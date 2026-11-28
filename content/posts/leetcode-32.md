---
title: "leetcode32:最长有效括号"
date: "2026-10-26"
description: "用 ()(() 解释失配的位置怎样决定连续括号的长度。"
---

<details class="problem-statement">
<summary>题面与示例（3 组）</summary>
<p>给定只含 <code>(</code> 和 <code>)</code> 的字符串 <code>s</code>，从中截取一段连续的字符，使其中的括号能完整配对。每个右括号要与前面尚未配对的一个左括号配对，结束时也不能剩下左括号。像 <code>(()())</code> 这样的嵌套是合法的。</p>
<p>返回能取到的最长长度，单位是字符。若没有非空的有效片段，返回 0。</p>
<p><strong>数据范围</strong>　字符串长度为 0–30000。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
s = &quot;(()&quot;
输出
2</code></pre>
<p>末尾两位组成 ()，开头的左括号没有配对。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
s = &quot;)()())&quot;
输出
4</code></pre>
<p>中间四个字符 ()() 连在一起，首尾的右括号都不能并入。</p>
<p><strong>示例 3</strong></p>
<pre><code>输入
s = &quot;&quot;
输出
0</code></pre>
<p>空串的最长有效长度是 0。</p>
<p><a href="https://leetcode.cn/problems/longest-valid-parentheses/description/">题目来源：力扣 32 · 最长有效括号</a></p>
</details>

## 解题思路

当时问的是 `"()(()"`：读到尾部才知道少一个右括号，前面的长度该怎么算？实际上下标 0–1 和 3–4 各有一段 `"()"`，中间下标 2 的左括号把它们隔开了。最长是 2。只数左右括号各有几个，会丢掉这条分界线。

栈里保存尚未配对的左括号下标，底部放最近一次失配的右括号下标，初始为 −1。匹配成功后，新的栈顶正好是当前合法后缀之前的位置。上例读到最后一个右括号时，弹出 3，露出 2，长度就是 4 − 2。

```python
def longest_valid(s):
    stack = [-1]
    best = 0
    for i, ch in enumerate(s):
        if ch == '(':
            stack.append(i)
        else:
            stack.pop()
            if stack:
                best = max(best, i - stack[-1])
            else:
                stack.append(i)
    return best
```


每个下标最多入栈和出栈各一次，时间为 O(n)。全是左括号时栈最长，额外空间为 O(n)。
