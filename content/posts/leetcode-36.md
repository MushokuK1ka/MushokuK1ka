---
title: "leetcode36:有效的数独"
date: "2026-10-26"
description: "扫描数独棋盘，记录每一行、每一列和每个宫中已经出现的数字。"
---

<details class="problem-statement">
<summary>题面与示例（2 组）</summary>
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
</details>

## 解题思路

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
