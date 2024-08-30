import subprocess


def main():
    subprocess.run(["ruff", "check", "."], check=True)


if __name__ == "__main__":
    main()
