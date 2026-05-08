# WeChat Sync Optimization Plan

## Objective
Fix the intermittent 500 `ERR_CONNECTION_CLOSED` errors on Vercel during WeChat synchronization.

## Root Cause Analysis
The Vercel Serverless environment has strict memory (e.g., 256MB/512MB) and execution time limits. The current implementation uses:
1. `JSDOM`: Extremely memory-intensive for parsing large HTML strings (especially those containing multiple Base64 images).
2. `sharp`: A native module for image processing. If it crashes or runs out of memory while allocating buffers for large images, it kills the entire Node.js process instantly, resulting in `ERR_CONNECTION_CLOSED`.

## Implementation Steps

### 1. Refactor `app/api/wechat/utils.ts`
- **Remove JSDOM**: Replace `JSDOM` in `processHtmlImages` with a robust Regular Expression to find and replace `<img src="...">` tags. This reduces memory overhead by >90%.
- **Defensive Sharp**: Wrap `sharp` calls in aggressive `try-catch` blocks. If an image doesn't strictly need resizing (i.e., it's under 1MB and is a JPEG/PNG), skip `sharp` entirely and upload the original buffer. If `sharp` fails on a required resize, throw a clean error rather than crashing the process.
- **Timeout Management**: Add explicit timeouts to any `fetch` or `axios.get` calls when downloading external images.

### 2. Refactor `app/api/wechat/sync/route.ts`
- Ensure all promises resolve cleanly and any top-level crash is caught (though removing JSDOM should prevent the hard crashes).

### 3. Update Package Dependencies
- Remove `jsdom` and `@types/jsdom` if they are no longer needed anywhere else in the project. (Optional, but good for cleanup).

## Verification
- Test local build.
- Deploy to Vercel and verify that syncing an article with multiple images no longer results in a 500 error or process crash.