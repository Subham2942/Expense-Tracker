from pathlib import Path

from setuptools import find_packages, setup


PROJECT_ROOT = Path(__file__).parent


def read_requirements():
    """Return install requirements, excluding comments and blank lines."""
    requirements_file = PROJECT_ROOT / "requirements.txt"
    return [
        line.strip()
        for line in requirements_file.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    ]


setup(
    name="expense-tracker-ds-service",
    version="0.1.0",
    description="Expense Tracker service for extracting expense data from messages",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    python_requires=">=3.9",
    install_requires=read_requirements(),
)
