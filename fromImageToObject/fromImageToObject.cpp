#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <iostream>
#include <pcl/io/pcd_io.h>
#include <pcl/point_types.h>
#include <pcl/kdtree/kdtree_flann.h>
#include <pcl/features/normal_3d.h>
#include <pcl/surface/gp3.h>
#include <pcl/io/vtk_io.h>
#include <pcl/io/obj_io.h>

using namespace cv;
using namespace std;

int main( int argc, char** argv )
{
    //Check Arguments
    if( argc != 2)
    {
        cout << "Inccorect use of command line arguments" << endl;
        cout << "Correct use:" << argv[ 0 ] << " <image>" << endl;
        return -1;
    }

    //Read the image as a depth image
    Mat image;
    image = imread( argv[1], CV_LOAD_IMAGE_GRAYSCALE );

    if( !image.data )                             
    {
        cout <<  "Could not open or find the image" << std::endl ;
        return -1;
    }

    image.convertTo( image, CV_32F );
    CV_Assert( image.depth() == CV_32F );
    float data[ image.cols ][ image.rows ];
    int left_index = -1;
    int right_index = 0;

    for( int i = 0; i < image.cols * image.rows; i++ )
    {
    	if( i % image.rows == 0 )
    	{
    		left_index++;
    		right_index = 0;
    	}
    	data[ left_index ][ right_index ] = image.at<float>( i );
    	right_index++;
    }

    
    //Create Cloud Object
    pcl::PointCloud<pcl::PointXYZ> pointCloudObject;

    // Fill in the cloud data
    pointCloudObject.width    = ((image.cols) / 2);
    pointCloudObject.height   = ((image.rows) / 2);
    pointCloudObject.is_dense = true;
    pointCloudObject.points.resize (pointCloudObject.width * pointCloudObject.height);

    int i = 1;
    for(int xCoord = 0; xCoord < image.cols; xCoord++){
        for(int yCoord = 0; yCoord < image.rows; yCoord++){
            if(xCoord%2 == 0 && yCoord%2 == 0){
                pointCloudObject.points[i].x = ((float)xCoord)/10;
                pointCloudObject.points[i].y = ((float)yCoord)/10;
                pointCloudObject.points[i].z = ((data[xCoord][yCoord]))/10;
                i++;
            }
            

            // cout << "Point " << i <<": " << "X: " << xCoord << ", Y: " << yCoord << ", Z: " << data[xCoord][yCoord] << endl;
            
        }
    }
    // cout << "Cols: " << image.cols << " Rows: " << image.rows << endl;

    //Pointer for the Object
    pcl::PointCloud<pcl::PointXYZ>::Ptr cloud (pointCloudObject.makeShared());

    // Normal estimation*
    pcl::NormalEstimation<pcl::PointXYZ, pcl::Normal> n;
    pcl::PointCloud<pcl::Normal>::Ptr normals (new pcl::PointCloud<pcl::Normal>);
    pcl::search::KdTree<pcl::PointXYZ>::Ptr tree (new pcl::search::KdTree<pcl::PointXYZ>);
    tree->setInputCloud (cloud);
    n.setInputCloud (cloud);
    n.setSearchMethod (tree);
    n.setKSearch (20);
    n.compute (*normals);
    
   // Concatenate the XYZ and normal fields*
  pcl::PointCloud<pcl::PointNormal>::Ptr cloud_with_normals (new pcl::PointCloud<pcl::PointNormal>);
  pcl::concatenateFields (*cloud, *normals, *cloud_with_normals);
  //* cloud_with_normals = cloud + normals

  // Create search tree*
  pcl::search::KdTree<pcl::PointNormal>::Ptr tree2 (new pcl::search::KdTree<pcl::PointNormal>);
  tree2->setInputCloud (cloud_with_normals);

  // Initialize objects
  pcl::GreedyProjectionTriangulation<pcl::PointNormal> gp3;
  pcl::PolygonMesh triangles;

  // Set the maximum distance between connected points (maximum edge length)
  gp3.setSearchRadius (18.0);

  // Set typical values for the parameters
  gp3.setMu (2.2);
  gp3.setMaximumNearestNeighbors (600);
  gp3.setMaximumSurfaceAngle(M_PI/4); // 45 degrees
  gp3.setMinimumAngle(M_PI/18); // 10 degrees
  gp3.setMaximumAngle(2*M_PI/3); // 120 degrees
  gp3.setNormalConsistency(false);

  // Get result
  gp3.setInputCloud (cloud_with_normals);
  gp3.setSearchMethod (tree2);
  gp3.reconstruct (triangles);

  // Additional vertex information
  std::vector<int> parts = gp3.getPartIDs();
  std::vector<int> states = gp3.getPointStates();

  //File Naming Convention
  std::string imageName = argv[1];
  size_t lastindex = imageName.find_last_of(".");
  imageName = imageName.substr(0, lastindex);

  lastindex = imageName.find_last_of("/");
  imageName = imageName.substr(lastindex+1);

  // cout << "Image name is: " << imageName << endl;

  if(pcl::io::saveOBJFile("/home/html/file_system/models/" + imageName + ".obj", triangles) == 0){
    cout << "Object Successfully Made" << endl;
    return 1;
  }
  else{
    cout << "Object Could not be Made" << endl;
    return 0;
  }


  // Finish
  printf("Done");
  return (0);
}

















