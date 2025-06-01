# https://leetcode.com/problems/maximal-rectangle/
class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:

        # initialize rectangle that stores # of 1ts starting at that square and going to the right
        n_rows = len(matrix)
        n_cols = len(matrix[0])

        # for each row, count how many contiguous 1s we have

        largest_found = 0
        # trailing 0 helps simplify calculations in find_largest
        len_heights = 1 + n_cols
        heights = [0] * (len_heights)
        stack = []

        for row in matrix:
            for c in range(0, n_cols):

                if row[c] == "1":
                    # add previous rows height, on r=0, this is equivalent to just setting to 1
                    heights[c] += 1
                else:
                    heights[c] = 0

            # this is >= height
            # to force the stack to be cleared
            # heights.append(0)

            for i in range(0, len_heights):
                # https://www.geeksforgeeks.org/largest-rectangular-area-in-a-histogram-using-stack/
                # If the stack is empty or arr[i] is higher than the bar at top of the stack, then push 'i' to stack.
                while stack and heights[i] < heights[stack[-1]]:
                    smallest_bar = heights[stack.pop()]

                    # because of the invariant we know everything up until i was at least the height
                    # of the top of the stack
                    right_index = i - 1
                    left_index = 0

                    # if there is something on the stack
                    # then we can assume that index + 1 until the removed item all had height at least of smallest_bar
                    if stack:
                        left_index = stack[-1] + 1

                    width = right_index - left_index + 1
                    largest_found = max(largest_found, width * smallest_bar)
                    # aka
                    # width = i - 1 - (stack[-1] + 1) + 1
                    # width = i - 1 - stack[-1] -1 + 1
                    # width = i - stack[-1] - 1

                stack.append(i)

            while stack:
                stack.pop()

        return largest_found
