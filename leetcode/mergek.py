# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
import heapq


# https://leetcode.com/problems/merge-k-sorted-lists/
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:

        heap = []

        # dummy node, handles empty lists gracefully
        ans = ListNode(0)
        cur_node = ans

        # Push tuples (value, original index)
        for idx, node in enumerate(lists):
            if not node:
                continue

            heap.append((node.val, idx))

        heapq.heapify(heap)

        while heap:
            _val, list_idx = heapq.heappop(heap)
            node = lists[list_idx]

            # append to answer
            cur_node.next = ListNode(node.val)
            cur_node = cur_node.next

            if not node.next:
                continue

            lists[list_idx] = node.next

            heapq.heappush(heap, (node.next.val, list_idx))

        return ans.next
