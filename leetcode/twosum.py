from typing import List


class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # hash map of indexes
        hm = {}
        for idx, n in enumerate(nums):
            if n not in hm:
                hm[n] = []

            hm[n].append(idx)
        
        for idx, n in enumerate(nums):
            other = target - n 
            
            if other not in hm:
                continue
            
            other_indices = hm[other]
            
            for i in other_indices:
                if i == idx:
                    continue
                
                return [idx, i]
        
        # should be impossible
        return []
    
def test_solution():
    
    s = Solution()
    
    assert s.twoSum([2,7,11,15], target = 9) == [0,1]
    
    assert s.twoSum([3,7,11,3], target = 6 ) == [0,3]