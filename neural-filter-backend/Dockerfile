FROM python:3.10

ENV PYTHONUNBUFFERED=1
WORKDIR /backend

ENV PYTHONPATH=/backend

EXPOSE 8080

COPY ./requirements.txt requirements.txt

RUN pip install -r requirements.txt --no-cache-dir

COPY ./neural_filter neural_filter

COPY ./scripts scripts

#CMD ["neural_filter/manage.py", "runserver", "localhost:8080"]
RUN chmod +x scripts/prestart.sh

# docker build -t nf-backend-test .
# docker run --rm -it nf-backend-test python neural_filter/manage.py runserver localhost:8080