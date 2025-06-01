# https://leetcode.com/problems/regular-expression-matching/
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        stack = [s]

        p = p + "$"

        p_tokens = []
        i = 0
        while i < len(p):
            if i < len(p) - 1 and p[i + 1] == "*":
                p_tokens.append(p[i] + "*")
                i += 2
                continue
            p_tokens.append(p[i])
            i += 1

        print(p_tokens)

        for token in p_tokens:
            next_stack = []
            for item in stack:
                if token == ".*":
                    for i in range(0, len(item)):
                        next_stack.append(item[0:-1])


def test_it():
    s = Solution()
    assert s.isMatch("a", "a*a*")
