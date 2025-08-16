# Use a slim Python image as the base
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy pyproject.toml and poetry.lock to the working directory
COPY pyproject.toml poetry.lock ./

# Install project dependencies using Poetry
RUN poetry install --only main

# Copy the rest of the application code
COPY app/ app/
COPY main.py main.py

# Expose the port that FastAPI will run on
EXPOSE 8000

# Command to run the application with Uvicorn
# Assuming main.py has `app = FastAPI()`
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
