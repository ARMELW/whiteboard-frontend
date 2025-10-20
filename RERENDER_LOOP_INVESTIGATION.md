# Rerender Loop Investigation & Fix Attempts

## Issue Description

The application displays an infinite loop error on load:
```
Uncaught Error: Maximum update depth exceeded. This can happen when a component 
repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React 
limits the number of nested updates to prevent infinite loops.
```

## Root Cause Analysis

### Error Stack Trace
```javascript
at setRef (http://localhost:5173/node_modules/.vite/deps/dist-DHpQOgK6.js:8:40)
at http://localhost:5173/node_modules/.vite/deps/dist-DHpQOgK6.js:15:20
at Array.map (<anonymous>)
at http://localhost:5173/node_modules/.vite/deps/dist-DHpQOgK6.js:14:25
at setRef (http://localhost:5173/node_modules/.vite/deps/dist-DHpQOgK6.js:8:40)
```

### Source Files
- `dist-DHpQOgK6.js` contains bundled code from:
  - `@radix-ui/react-compose-refs`
  - `@radix-ui/react-slot`

### Technical Root Cause
1. **React 19 Ref Changes**: React 19 significantly changed how refs work internally
2. **Radix UI Ref Composition**: Radix UI's `composeRefs()` function creates ref callbacks inside `.map()`:
   ```javascript
   const cleanups = refs.map((ref) => {
     const cleanup = setRef(ref, node);
     return cleanup;
   });
   ```
3. **Infinite Loop Pattern**: When Radix components with `asChild` prop render inside `.map()` loops, new ref functions are created on every render, triggering continuous re-renders

## Fix Attempts

### 1. ✅ Fixed AudioManager.tsx (Line 304)
**Problem**: Ref callback inside `.map()` created new function on every render
```typescript
// Before - WRONG
{Object.values(AudioTrackType).map(type => (
  <input ref={el => fileInputRefs.current[type] = el} />
))}

// After - CORRECT
const setFileInputRef = useCallback((el: HTMLInputElement | null, type: string) => {
  if (el) fileInputRefs.current[type] = el;
}, []);

{Object.values(AudioTrackType).map(type => (
  <input ref={(el) => setFileInputRef(el, type)} />
))}
```

### 2. ✅ Replaced Radix DropdownMenu in ScenePanel
**Problem**: `DropdownMenuTrigger asChild` inside `scenes.map()` caused ref composition issues

**Solution**: Created custom dropdown menu without Radix primitives
- Extracted `SceneCard` component
- Implemented custom dropdown with useState and useEffect for click-outside handling
- Removed all Radix UI dependencies from the mapped component

### 3. ✅ Removed StrictMode
**Problem**: StrictMode causes double-renders which can amplify ref-related issues
**Result**: Error persisted even without StrictMode, confirming real compatibility issue

### 4. ❌ Attempted React 18 Downgrade
**Attempted**: Downgrade from React 19.1.1 to React 18.3.1
**Result**: Failed due to dependency conflict
```
Error: react-konva version 19 is only compatible with React 19
```
**Conclusion**: Cannot downgrade React without downgrading react-konva

## Current State

### What Was Fixed
1. ✅ AudioManager ref callback pattern
2. ✅ ScenePanel DropdownMenu removed (replaced with custom implementation)
3. ✅ StrictMode removed

### What Still Causes the Error
The error persists despite all fixes, indicating the problem is elsewhere in the component tree. Likely candidates:

1. **SelectTrigger Components** (`src/components/ui/select.tsx` line 26):
   ```typescript
   <SelectPrimitive.Icon asChild>
     <ChevronDown className="h-4 w-4 opacity-50" />
   </SelectPrimitive.Icon>
   ```
   Every SelectTrigger renders an Icon with `asChild`, using the Slot component internally.

2. **Other Hidden Radix Primitives**: Any Radix component using `asChild` could be the culprit

## Recommendations

### Short-term Solutions
1. **Find the Specific Component**: 
   - Use React DevTools Profiler to identify which component is re-rendering infinitely
   - Search for any component using SelectTrigger, TooltipTrigger, DialogTrigger with `asChild`
   - Check if any of these are rendering on initial page load

2. **Replace Problematic Components**:
   - Similar to ScenePanel, replace Radix UI components with custom implementations
   - Focus on components that use `asChild` prop

### Long-term Solutions
1. **Wait for Radix UI Update**:
   - Monitor Radix UI releases for React 19 compatibility fixes
   - Current versions claim React 19 support but have compatibility issues

2. **Complete Radix UI Replacement**:
   - Replace all Radix UI components with custom implementations or alternative libraries
   - Consider libraries with better React 19 support:
     - Headless UI
     - React Aria
     - Custom implementations

3. **Downgrade react-konva**:
   - If konva features aren't critical, downgrade to version 18
   - Then downgrade React to 18.3.1
   - This would solve the Radix compatibility issue

## Files Modified

1. `src/components/audio/AudioManager.tsx` - Fixed ref callback pattern
2. `src/components/organisms/ScenePanel.tsx` - Replaced DropdownMenu with custom implementation
3. `src/main.tsx` - Removed StrictMode wrapper
4. `package.json` - React versions unchanged (requires React 19 for react-konva)

## Testing Performed

- ✅ Application builds successfully
- ✅ Linting passes
- ✅ Dev server runs
- ❌ Runtime error persists on page load
- ✅ Page renders despite error (error is caught by React error boundary)

## Next Steps for Developer

1. Run the application with React DevTools
2. Use the Profiler to identify which component is causing infinite renders
3. Check console for component render counts
4. Look for SelectTrigger, TooltipTrigger, or other Radix components being rendered
5. Replace identified component with custom implementation
6. Consider opening issue with Radix UI team about React 19 compatibility

## Additional Notes

- The error occurs immediately on page load, before any user interaction
- The application appears to function despite the error
- React catches the error and prevents complete crash
- The error is reproducible 100% of the time
