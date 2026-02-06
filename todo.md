# Ω Pedia Fix - Duplicate Headers and Naming

## Issues Found:
- [x] WikiLayout has "MegaPedia" header with search bar (top)
- [x] ArticlePage has "Ω Pedia" header with search bar (second)
- [x] Two search bars visible on entry pages
- [x] Inconsistent naming: "MegaPedia" vs "Ω Pedia"

## Solution:
- [ ] Entry pages should NOT use WikiLayout (they have ArticlePage with its own header)
- [ ] Update WikiLayout naming from "MegaPedia" to "Ω Pedia"
- [ ] Check Entry.tsx to remove WikiLayout wrapper
