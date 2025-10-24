# Google Colab Keep-Alive Tip

**Problem:** Colab disconnects after 90 minutes of inactivity during long training sessions.

**Solution:** Use this simple JavaScript snippet to prevent disconnections.

## Quick Setup

1. Open your browser's **Developer Console**:
   - **Chrome/Edge:** Press `F12` or `Ctrl + Shift + J` (Windows/Linux) / `Cmd + Option + J` (Mac)
   - **Firefox:** Press `F12` or `Ctrl + Shift + K` (Windows/Linux) / `Cmd + Option + K` (Mac)

2. Copy and paste this code into the console:

```javascript
function keepAlive() {
  console.log('⚡ Keep-alive ping:', new Date().toLocaleTimeString());
  document.querySelector("colab-connect-button")?.click();
  document.querySelector('md-icon-button[aria-label*="comment"]')?.click();
  setTimeout(() => document.querySelector('md-icon-button[aria-label*="comment"]')?.click(), 500);
}
setInterval(keepAlive, 60000); // Every 60 seconds
console.log('✅ Keep-alive active!');
```

3. Press **Enter** to execute

4. Leave the browser tab open (minimized is fine)

## What It Does

- Simulates activity by clicking the connect button and comments button every 60 seconds
- Toggles the comments pane open/close to show activity
- Logs timestamps to console so you can verify it's working
- Prevents Colab's idle timeout (90-minute limit)
- Does not interfere with training

## Additional Tips

- Use **Windows PowerToys - Awake** to prevent your PC from sleeping
- Use **Windows PowerToys - Always On Top** to keep Colab window visible
- Open the notebook in **two browser tabs** as backup
- Model checkpoints save every epoch, so you can resume if disconnected

## Verification

You should see console messages like:
```
✅ Keep-alive active!
⚡ Keep-alive ping: 10:30:45
⚡ Keep-alive ping: 10:31:45
⚡ Keep-alive ping: 10:32:45
```

## Training Time Estimates

| Model | Epochs | GPU | Estimated Time |
|-------|--------|-----|----------------|
| MobileNetV2 | 50 | T4 (Free) | 2.5-3 hours |
| EfficientNetB0 | 50 | T4 (Free) | 3-4 hours |
| Baseline CNN | 50 | T4 (Free) | 1.5-2 hours |

**Note:** Keep-alive is especially important for sessions longer than 90 minutes.
