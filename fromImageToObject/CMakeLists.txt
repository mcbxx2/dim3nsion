cmake_minimum_required(VERSION 2.8 FATAL_ERROR)
project(fromImageToObject)

find_package(OpenCV REQUIRED)
find_package(PCL 1.2 REQUIRED)

add_executable (fromImageToObject fromImageToObject.cpp)
target_link_libraries (fromImageToObject ${PCL_LIBRARIES})
target_link_libraries( fromImageToObject ${OpenCV_LIBS} )


include_directories(${PCL_INCLUDE_DIRS})
link_directories(${PCL_LIBRARY_DIRS})
add_definitions(${PCL_DEFINITIONS})

