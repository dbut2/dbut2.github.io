---
title: Go range over funcs
date: 2024-05-14
draft: false
---
Following discussions and read throughs on the following proposal, I hadn't fully understood what the use case for this was or what the value of being able to range over functions would be.spec: add range over int, range over func · Issue #61405 · golang/go  
Following discussion on #56413, I propose to add two new types that a for-range statement can range over: integers and functions. In the spec, the table that begins the section would have a few mor…  
GitHubgolangGo Wiki: Rangefunc Experiment - The Go Programming Language  
Google logoAfter taking a look through previous years advent of code solutions and helper packages I had found a repeated pattern I realised could be simplified if we could range over functions.Consider the following rudimentary implementation of a queue in Go:type Queue\[T any\] \[\]T  
func (q _Queue\[T\]) Push(v T) {  
_q = append(\*q, v)  
}  
func (q _Queue\[T\]) Pop() T {  
v := (_q)\[0\]  
_q = (_q)\[1:\]  
return v  
}  
Rudimentary queue implementationIn order to action item correctly, this is the current usage of pulling every item:q := Queue\[any\]{}  
for len(q) > 0 {  
item := q.Pop()  
dosomething(item)  
}  
Current queue usageThere's two things here that aren't ideal:It requires the user to check the length of the queue before pulling, this isn't the case for ranging over other data types like slices  
To pull each item the user is required to call a function on a new line, this should be able to be abstracted  
Luckily, the ability to be able to define this functionality can be abstracted away from the user, thanks to the proposal.Given the following definition of a sequence type, a function that can be used in a range call:type Seq\[V any\] func(func(V)bool)  
Sequence definitionWe can implement this type as a method on the queue, managing the length check and popping functionality for the user:func (q _Queue\[T\]) Seq(yield func(T) bool) {  
for len(_q) > 0 {  
item := q.Pop()  
if !yield(item) {  
return  
}  
}  
}  
Sequence definitionMeaning pulling all items from the queue can be simplified to:q := Queue\[any\]{}  
for item := range q.Seq {  
dosomething(item)  
}  
Future usage with ranging over functionThis covers the case of using a sequence to define the input to the for loop, but we can also create sequences to define custom behaviour of ranging over existing [input.One](http://input.One) behaviour we might want to control is ranging over an existing map, normally when we range over maps the items will be returned out of order:m := map\[int\]int{}  
for i := range 10 {  
    m\[i\] = i  
}for k, v := range m {  
    fmt.Println(k, v)  
}  
Builtin range over map2 2  
3 3  
5 5  
8 8  
9 9  
0 0  
1 1  
4 4  
6 6  
7 7  
Output of builtin rangeWhat if we want the items in order? Let's look at the following sequence:type Seq2\[K, V any\] func(func(K, V)bool)func OrderedMap\[K cmp.Ordered, V any\](m map\[K\]V) Seq2\[K, V\] {  
keys := make(\[\]K, 0, len(m))  
for k := range m {  
keys = append(keys, k)  
}  
slices.Sort(keys)  
return func(yield func(K, V)bool) {  
for \_, k := range keys {  
if !yield(k, m\[k\]) {  
return  
}  
}  
}  
}  
Ordered map sequence definiitonOrderedMap here returns a sequence consisting of two values, K, and V, which allows us to pull two items as opposed to one in the previous [example.Here](http://example.Here) we first pull the keys from the map and then yield over the for loop in the order of keys.Passing this new sequence function into our range from before results in:m := map\[int\]int{}  
for i := range 10 {  
    m\[i\] = i  
}for k, v := range OrderedMap(m) {  
    fmt.Println(k, v)  
}  
Ordered range of map0 0  
1 1  
2 2  
3 3  
4 4  
5 5  
6 6  
7 7  
8 8  
9 9  
Output of ordered rangeMeaning now rather than creating the input our range we're simply modifying the behaviour of ranging over existing data.Though I'm not quite sure how this will fit into the Go ecosystem, and not quite yet sold on the proposal, should this go ahead hopefully we get it before advent of code this year as part of go1.23 release in August, every second counts on that leaderboard.

![white_tick](https://a.slack-edge.com/production-standard-emoji-assets/14.0/apple-small/2705@2x.png)![eyes](https://a.slack-edge.com/production-standard-emoji-assets/14.0/apple-small/1f440@2x.png)![raised_hands](https://a.slack-edge.com/production-standard-emoji-assets/14.0/apple-small/1f64c@2x.png)