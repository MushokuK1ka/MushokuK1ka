---
title: "leecode36:有效的数独、leecode37:解数独"
date: "2026-10-27"
description: "复用行、列和宫的占用记录，写出能撤销选择的数独求解器。"
---

10 月 26 日先做了数独的规则检查。第二天遇到解数独，正好可以把前一天写的检查接到回溯里。两题使用同一张样例棋盘。

## leecode36:有效的数独

<div class="problem-statement">
<p>输入一个部分填好的 9 × 9 数独棋盘 <code>board</code>。每个格子是一个字符，<code>&quot;.&quot;</code> 表示空格，其他格子写着 1 至 9 中的某个数字。棋盘分成九个互不重叠的 3 × 3 宫。</p>
<p>逐一检查三条规则：同一行里不能有两个相同的数字。同一列里不能有两个相同的数字。同一个宫里也不能有两个相同的数字。只检查已经填入的格子，空格不参与比较。</p>
<p>只要三条规则都满足，就返回 <code>true</code>。出现任何冲突就返回 <code>false</code>。通过检查的局面可能无法填完，这一题不要求求解。</p>
<p><strong>数据范围</strong>　棋盘固定为九行九列，格子只能是字符 <code>1</code>–<code>9</code> 或表示空格的 <code>.</code>。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
board = [
  [&quot;5&quot;, &quot;3&quot;, &quot;.&quot;, &quot;.&quot;, &quot;7&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;],
  [&quot;6&quot;, &quot;.&quot;, &quot;.&quot;, &quot;1&quot;, &quot;9&quot;, &quot;5&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;],
  [&quot;.&quot;, &quot;9&quot;, &quot;8&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;6&quot;, &quot;.&quot;],
  [&quot;8&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;6&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;3&quot;],
  [&quot;4&quot;, &quot;.&quot;, &quot;.&quot;, &quot;8&quot;, &quot;.&quot;, &quot;3&quot;, &quot;.&quot;, &quot;.&quot;, &quot;1&quot;],
  [&quot;7&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;2&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;6&quot;],
  [&quot;.&quot;, &quot;6&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;2&quot;, &quot;8&quot;, &quot;.&quot;],
  [&quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;4&quot;, &quot;1&quot;, &quot;9&quot;, &quot;.&quot;, &quot;.&quot;, &quot;5&quot;],
  [&quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;8&quot;, &quot;.&quot;, &quot;.&quot;, &quot;7&quot;, &quot;9&quot;]
]
输出
true</code></pre>
<p>已填的数字在各行、各列和各宫中均无重复。空格可以保留。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
board = [
  [&quot;8&quot;, &quot;3&quot;, &quot;.&quot;, &quot;.&quot;, &quot;7&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;],
  [&quot;6&quot;, &quot;.&quot;, &quot;.&quot;, &quot;1&quot;, &quot;9&quot;, &quot;5&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;],
  [&quot;.&quot;, &quot;9&quot;, &quot;8&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;6&quot;, &quot;.&quot;],
  [&quot;8&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;6&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;3&quot;],
  [&quot;4&quot;, &quot;.&quot;, &quot;.&quot;, &quot;8&quot;, &quot;.&quot;, &quot;3&quot;, &quot;.&quot;, &quot;.&quot;, &quot;1&quot;],
  [&quot;7&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;2&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;6&quot;],
  [&quot;.&quot;, &quot;6&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;2&quot;, &quot;8&quot;, &quot;.&quot;],
  [&quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;4&quot;, &quot;1&quot;, &quot;9&quot;, &quot;.&quot;, &quot;.&quot;, &quot;5&quot;],
  [&quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;8&quot;, &quot;.&quot;, &quot;.&quot;, &quot;7&quot;, &quot;9&quot;]
]
输出
false</code></pre>
<p>左上角的 5 改为 8 后，左上宫的第一行和第三行各有一个 8，已经冲突。</p>
<p><a href="https://leetcode.cn/problems/valid-sudoku/description/">题目来源：力扣 36 · 有效的数独</a></p>
</div>

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

## leecode37:解数独

<div class="problem-statement">
<p>输入一个 9 × 9 字符矩阵 <code>board</code>。数字 <code>1</code> 至 <code>9</code> 是已经给定的格子，<code>&quot;.&quot;</code> 代表待填的空格。九个互不重叠的 3 × 3 区域称为宫。</p>
<p>请在原棋盘上补齐所有空格，保留已给出的数字。填好后，每一行中 1 至 9 都恰好出现一次，每一列也各出现一次，九个宫中的每一个同样如此。输入保证只有一组解，下面“输出”列出的是填好的棋盘。</p>
<p><strong>数据范围</strong>　空格用 <code>.</code> 表示，每组输入恰有一个解。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
board = [
  [&quot;5&quot;, &quot;3&quot;, &quot;.&quot;, &quot;.&quot;, &quot;7&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;],
  [&quot;6&quot;, &quot;.&quot;, &quot;.&quot;, &quot;1&quot;, &quot;9&quot;, &quot;5&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;],
  [&quot;.&quot;, &quot;9&quot;, &quot;8&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;6&quot;, &quot;.&quot;],
  [&quot;8&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;6&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;3&quot;],
  [&quot;4&quot;, &quot;.&quot;, &quot;.&quot;, &quot;8&quot;, &quot;.&quot;, &quot;3&quot;, &quot;.&quot;, &quot;.&quot;, &quot;1&quot;],
  [&quot;7&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;2&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;6&quot;],
  [&quot;.&quot;, &quot;6&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;2&quot;, &quot;8&quot;, &quot;.&quot;],
  [&quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;4&quot;, &quot;1&quot;, &quot;9&quot;, &quot;.&quot;, &quot;.&quot;, &quot;5&quot;],
  [&quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;.&quot;, &quot;8&quot;, &quot;.&quot;, &quot;.&quot;, &quot;7&quot;, &quot;9&quot;]
]
输出
[
  [&quot;5&quot;, &quot;3&quot;, &quot;4&quot;, &quot;6&quot;, &quot;7&quot;, &quot;8&quot;, &quot;9&quot;, &quot;1&quot;, &quot;2&quot;],
  [&quot;6&quot;, &quot;7&quot;, &quot;2&quot;, &quot;1&quot;, &quot;9&quot;, &quot;5&quot;, &quot;3&quot;, &quot;4&quot;, &quot;8&quot;],
  [&quot;1&quot;, &quot;9&quot;, &quot;8&quot;, &quot;3&quot;, &quot;4&quot;, &quot;2&quot;, &quot;5&quot;, &quot;6&quot;, &quot;7&quot;],
  [&quot;8&quot;, &quot;5&quot;, &quot;9&quot;, &quot;7&quot;, &quot;6&quot;, &quot;1&quot;, &quot;4&quot;, &quot;2&quot;, &quot;3&quot;],
  [&quot;4&quot;, &quot;2&quot;, &quot;6&quot;, &quot;8&quot;, &quot;5&quot;, &quot;3&quot;, &quot;7&quot;, &quot;9&quot;, &quot;1&quot;],
  [&quot;7&quot;, &quot;1&quot;, &quot;3&quot;, &quot;9&quot;, &quot;2&quot;, &quot;4&quot;, &quot;8&quot;, &quot;5&quot;, &quot;6&quot;],
  [&quot;9&quot;, &quot;6&quot;, &quot;1&quot;, &quot;5&quot;, &quot;3&quot;, &quot;7&quot;, &quot;2&quot;, &quot;8&quot;, &quot;4&quot;],
  [&quot;2&quot;, &quot;8&quot;, &quot;7&quot;, &quot;4&quot;, &quot;1&quot;, &quot;9&quot;, &quot;6&quot;, &quot;3&quot;, &quot;5&quot;],
  [&quot;3&quot;, &quot;4&quot;, &quot;5&quot;, &quot;2&quot;, &quot;8&quot;, &quot;6&quot;, &quot;1&quot;, &quot;7&quot;, &quot;9&quot;]
]</code></pre>
<p>在给定棋盘中填上所有空格后，每一行、每一列、每一宫都含有 1 至 9，原来给出的数字保持在原位。</p>
<p><a href="https://leetcode.cn/problems/sudoku-solver/description/">题目来源：力扣 37 · 解数独</a></p>
</div>

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
