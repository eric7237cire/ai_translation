import re

normal = re.compile(
    r"""
        [-+]?
 (?: 
    # either match at least one digit before the .
    (?:\d+
    \.?
    \d*) 
    |  # or afterwards
    (?:\d*
    \.?
    \d+)
)
# match optional exponent extention
(?:
    [eE]
    [+-]?
    \d+
)?
""",
    re.VERBOSE,
)


class Solution:
    def isNumber(self, s: str) -> bool:
        return normal.fullmatch(s) is not None
