---
title: "从有效数独到解数独：把检查过的格子记下来"
date: "2026-10-27"
description: "复用行、列和宫的占用记录，写出能撤销选择的数独求解器。"
---

10 月 26 日先做了数独的规则检查。第二天遇到解数独，正好可以把前一天写的检查接到回溯里。两题使用同一张样例棋盘。

## 36 · 有效的数独

给定一张部分填好的 9 × 9 棋盘。判断已填数字在每一行、每一列、每个 3 × 3 宫里是否都没有重复。满足三条规则就返回 `True`，即使从当前局面出发未必有解。 [力扣原题全文](https://leetcode.cn/problems/valid-sudoku/description/)

**数据范围**　棋盘固定为九行九列，格子只能是字符 `1`–`9` 或表示空格的 `.`。

**题目样例**　下方棋盘返回 `True`。若把它左上角的 `5` 改为 `8`，左上宫会出现两个 `8`，返回 `False`。

```text
53..7....
6..195...
.98....6.
8...6...3
4..8.3..1
7...2...6
.6....28.
...419..5
....8..79
```

### 解题思路

做有效数独时，首先想到逐行、逐列、逐宫检查。固定的 9 × 9 棋盘上，这个办法完全够用。也可以只扫描一次：遇到数字就记到它所属的行、列、宫里。三处只要有一处已经见过它，就产生了冲突。空格直接跳过。通过检查只能说明已填数字相容，棋盘是否有解还得继续推。

下面的函数读完整张棋盘，碰到冲突就返回 `None`。第 36 题据此返回一个布尔值。

```python
def sudoku_state(board):
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    empty = []
    for r, row in enumerate(board):
        for c, digit in enumerate(row):
            box = (r // 3) * 3 + c // 3
            if digit == '.':
                empty.append((r, c, box))
            elif digit in rows[r] or digit in cols[c] or digit in boxes[box]:
                return None
            else:
                rows[r].add(digit)
                cols[c].add(digit)
                boxes[box].add(digit)
    return rows, cols, boxes, empty

def is_valid_sudoku(board):
    return sudoku_state(board) is not None
```

## 37 · 解数独

给定含空格的 9 × 9 棋盘，把空格补上，让每行、每列和每个 3 × 3 宫都恰好包含一次 1–9。保留题目给定的数字，在原棋盘上写入解。 [力扣原题全文](https://leetcode.cn/problems/sudoku-solver/description/)

**数据范围**　空格用 `.` 表示，每组输入恰有一个解。

**题目样例**　下面两栏分别是题目给定的棋盘和填好后的棋盘，每一行对应棋盘的一行。

```text
给定棋盘     填写结果
53..7....    534678912
6..195...    672195348
.98....6.    198342567
8...6...3    859761423
4..8.3..1    426853791
7...2...6    713924856
.6....28.    961537284
...419..5    287419635
....8..79    345286179
```

### 解题思路

第二天做解数独，最初想每填一个数字就调用上一题的检查函数，再用回溯退回填错的位置。可刚才已检查过的八行并没有变化。于是把三组记录留在递归外面：填一个数时各加一次，试出死路时各删一次。求解器复用上面的 `sudoku_state`。

```python
def solve_sudoku(board):
    state = sudoku_state(board)
    if state is None:
        return False
    rows, cols, boxes, empty = state

    def fill(index):
        if index == len(empty):
            return True
        r, c, box = empty[index]
        for d in '123456789':
            if d in rows[r] or d in cols[c] or d in boxes[box]:
                continue
            board[r][c] = d
            rows[r].add(d)
            cols[c].add(d)
            boxes[box].add(d)
            if fill(index + 1):
                return True
            board[r][c] = '.'
            rows[r].remove(d)
            cols[c].remove(d)
            boxes[box].remove(d)
        return False

    return fill(0)
```

对照官方代码时，最让我在意的是它撤销了占用标记，却没把格子擦回 `'.'`。它提前记录了所有空格，尝试下一种数字时会直接覆盖旧值。判断能填什么也只读占用表，所以这两件事可以分开。上面的版本选择让棋盘和占用表始终一致，找到解就逐层返回。[力扣官方《解数独》题解](https://leetcode.cn/problems/sudoku-solver/solutions/414120/jie-shu-du-by-leetcode-solution/)

对话里还对比了两次提交显示的 1337 ms 和 29 ms。仅凭这两个数，没法把差距归到某一行代码。能从实现里辨认出两种不同的节省：用九个二进制位表示九个数字，能一次算出某格的全部候选。优先试候选最少的空格，则可能少走整棵子树。一个格子只剩 1 个候选，另一个还有 5 个，先填前者就没有五选一的分叉。
