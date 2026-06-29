#!/usr/bin/env python3
"""
Captcha solver sidecar.

Attaches to the SAME Chromium instance that the Java/Playwright app launched
(via its remote-debugging port) and solves the reCAPTCHA in-place using
sarperavci/GoogleRecaptchaBypass (audio-challenge + speech-to-text). Because it
attaches to the existing tab, it operates inside your already-authenticated
visa-portal session — no separate browser, no lost cookies.

Usage:
    python3 solve.py <debug-address>      e.g.  python3 solve.py 127.0.0.1:9222

Exit codes:
    0  captcha solved
    2  solver ran but reported failure
    3  setup/attach error (deps missing, repo not cloned, cannot attach)

Setup (one time):  ./setup-captcha.sh
"""
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
# The upstream library is cloned here by setup-captcha.sh
sys.path.insert(0, os.path.join(HERE, "GoogleRecaptchaBypass"))


def main() -> int:
    addr = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1:9222"

    try:
        from DrissionPage import ChromiumPage, ChromiumOptions
    except Exception as e:  # noqa: BLE001
        print(f"[captcha] DrissionPage not installed: {e}", flush=True)
        print("[captcha] run ./setup-captcha.sh first", flush=True)
        return 3

    try:
        from RecaptchaSolver import RecaptchaSolver
    except Exception as e:  # noqa: BLE001
        print(f"[captcha] GoogleRecaptchaBypass not found: {e}", flush=True)
        print("[captcha] run ./setup-captcha.sh to clone it", flush=True)
        return 3

    try:
        opts = ChromiumOptions().set_address(addr)
        driver = ChromiumPage(opts)
    except Exception as e:  # noqa: BLE001
        print(f"[captcha] could not attach to browser at {addr}: {e}", flush=True)
        return 3

    try:
        print(f"[captcha] attached to {addr}, solving audio challenge...", flush=True)
        solver = RecaptchaSolver(driver)
        t0 = time.time()
        solver.solveCaptcha()
        print(f"[captcha] solveCaptcha() returned after {time.time() - t0:.1f}s", flush=True)
    except Exception as e:  # noqa: BLE001
        print(f"[captcha] solve failed: {e}", flush=True)
        return 2

    # Confirm the token field is populated before reporting success.
    try:
        token = driver.run_js(
            "var el=document.getElementById('g-recaptcha-response');"
            "return el ? el.value : '';"
        )
        if token:
            print("[captcha] token present — solved.", flush=True)
            return 0
        print("[captcha] no token after solve — treating as failure.", flush=True)
        return 2
    except Exception as e:  # noqa: BLE001
        # If we cannot read it back, assume solveCaptcha succeeded if it didn't throw.
        print(f"[captcha] could not verify token ({e}); assuming solved.", flush=True)
        return 0


if __name__ == "__main__":
    sys.exit(main())
