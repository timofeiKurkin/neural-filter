FROM python:3.10

ENV PYTHONUNBUFFERED=1
WORKDIR /neural_filter-backend

ENV PYTHONPATH=/neural_filter-backend

EXPOSE 8080

COPY requirements.txt .

RUN pip install -r requirements.txt --no-cache-dir

COPY . .

CMD ["neural_filter/manage.py", "runserver", "localhost:8080"]

# docker build -t nf-backend-test .
# docker run --rm -it nf-backend-test python neural_filter/manage.py runserver localhost:8080