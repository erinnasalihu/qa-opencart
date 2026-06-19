import os, datetime


def save(driver, test_name: str, label: str = "fail") -> str:
    ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    out_dir = "reports/screenshots"
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{test_name}-{label}-{ts}.png")
    driver.save_screenshot(path)
    return path
