#include <iostream>
#include <vector>
using namespace std;

// Given an integer array nums, find the subarray with the largest sum, and return its sum.
// Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
// Output: 6
// Explanation: The subarray [4,-1,2,1] has the largest sum 6.
// Example 2:

// Input: nums = [1]
// Output: 1
// Explanation: The subarray [1] has the largest sum 1.
// Example 3:

// Input: nums = [5,4,-1,7,8]
// Output: 23
// Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.

int main()
{
    int sum = 0;
    int maxSum = INT32_MIN;
    vector<int> vec = {5, 4, -1, 7, 8};

    for (int value : vec)
    {
        sum = sum + value;
        maxSum = max(sum, maxSum);
        if (sum < 0)
        {
            sum = 0;
        }
    }
    cout << maxSum << endl;
}

// Solved using Kandane's Algorithm