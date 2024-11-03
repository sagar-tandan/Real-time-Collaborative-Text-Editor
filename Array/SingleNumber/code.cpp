#include <iostream>
#include <vector>

// Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.
// Input: nums = [2,2,1]
// Output: 1
using namespace std;

int main()
{
    int sum = 0;
    vector<int> vec = {2, 2, 1};
    for (int val : vec)
    {
        sum ^= val;
    }
    cout << sum << endl;
}

// In case of vector we are using for each loop and in that loop val represent value not index