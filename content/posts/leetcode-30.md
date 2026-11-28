---
title: "leetcode30:串联所有单词的子串"
date: "2026-10-25"
description: "用 abba 的重叠反例解释词频、窗口和按余数分组。"
---

<details class="problem-statement">
<summary>题面与示例（3 组）</summary>
<p>给定字符串 <code>s</code> 和单词列表 <code>words</code>。所有单词长度相同。从 <code>s</code> 中找出所有满足下述条件的连续片段，返回它们的起始下标（从 0 计数），结果可以按任意顺序排列。</p>
<p>一个片段必须能按词长切成若干块，块与块之间没有间隔也没有重叠。所有块恰好用完 <code>words</code>，顺序可以改变，同一个词在列表中出现几次就要用几次。</p>
<p>例如，词表为 <code>[&quot;ab&quot;, &quot;cd&quot;, &quot;ef&quot;]</code> 时，六种拼法是 <code>abcdef</code>、<code>abefcd</code>、<code>cdabef</code>、<code>cdefab</code>、<code>efabcd</code>、<code>efcdab</code>。<code>acdbef</code> 虽然字符相同，但切出的 <code>ac</code> 和 <code>db</code> 不在词表中。</p>
<p><strong>数据范围</strong>　<code>s</code> 长 1–10⁴，单词数 1–5000，单词长度 1–30。所有字符均为小写英文字母。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
s = &quot;barfoothefoobarman&quot;
words = [&quot;foo&quot;, &quot;bar&quot;]
输出
[0, 9]</code></pre>
<p>从下标 0 读到 bar | foo，从 9 读到 foo | bar。两段都恰好用完词表。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
s = &quot;wordgoodgoodgoodbestword&quot;
words = [&quot;word&quot;, &quot;good&quot;, &quot;best&quot;, &quot;word&quot;]
输出
[]</code></pre>
<p>每一段候选都长 16 个字符，其中必须有两个 word、一个 good 和一个 best。没有一段能满足这些次数。</p>
<p><strong>示例 3</strong></p>
<pre><code>输入
s = &quot;barfoofoobarthefoobarman&quot;
words = [&quot;bar&quot;, &quot;foo&quot;, &quot;the&quot;]
输出
[6, 9, 12]</code></pre>
<p>三个起点分别读出 foo | bar | the、bar | the | foo、the | foo | bar。合法的子串可以相互重叠。</p>
<p><a href="https://leetcode.cn/problems/substring-with-concatenation-of-all-words/description/">题目来源：力扣 30 · 串联所有单词的子串</a></p>
</details>

## 解题思路

10 月 25 日晚上做串联子串，起初打算用 KMP 找出每个单词在原串里的下标，再从出现次数最少的那个词向两边拼。写到这里卡住了。后来自己举了个反例：`abba` 里既有 `abb`，也有 `bba`，两个词都找到了，却连一个答案都拼不出来。它们占用了同一段字符。

用最少见的词当锚点，确实能减少候选。但它可能排在答案的开头、中间或末尾。即使知道所有匹配位置，仍要处理次序、重复和重叠。试着枚举排列又走得太远了：题目允许任意顺序，判断一段是否合法，只需对照词频。

把 `barfoothefoobarman` 每三个字符切一块，得到 `bar | foo | the | foo | bar | man`。要找的词是 `bar` 和 `foo`。开头两块正好，记下 0。读到 `the`，任何跨过它的窗口都可以丢掉。后面 `foo | bar` 又给出起点 9。

当时我追问，从 0 开始每次走三格，那 1、2、4、5 怎么办？这几个下标恰好属于另外两组。单词长度为 3 时，从 0、1、2 各扫一遍。每个可能的起点都能按照除以 3 的余数找到自己那一组。比如给刚才的字符串前面加一个 `x`，答案就变成 1 和 10，都由第二组找到。

同一组里，右边每进一个词，窗口只会多出这一个词。如果它超额，左边就逐词移出，直到次数合适。这里把最初想的“每词一次”修正为“每词不超过所需次数”。当窗口又恰好装下全部单词时，每个词的次数自然都对了。

```python
from collections import Counter

def find_substrings(s, words):
    if not words or not words[0]:
        return []
    width, count = len(words[0]), len(words)
    if len(s) < width * count:
        return []
    need = Counter(words)
    starts = []
    for offset in range(width):
        left = offset
        have = Counter()
        for right in range(offset, len(s) - width + 1, width):
            word = s[right:right + width]
            if word not in need:
                have.clear()
                left = right + width
                continue
            have[word] += 1
            while have[word] > need[word]:
                have[s[left:left + width]] -= 1
                left += width
            if right + width - left == width * count:
                starts.append(left)
    return starts
```

记下答案后可以保留窗口。下一个词若在词表里，原窗口的配额都已用满，收缩循环会自然腾出位置。因此 `foofoofoo` 配两个 `foo` 能找到 0 和 3 两个重叠答案。各组加起来处理的词块数是线性的。若把 Python 复制切片和计算哈希的字符开销算进去，串长为 n、词长为 w 时，扫描耗时为 O(nw)。
