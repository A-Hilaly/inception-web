FROM python:3.5

ADD ./static .
ADD ./templates .
ADD inception.py .
ADD demo.py .
ADD Makefile .
ADD requirements.txt .

CMD pip3 install -r requirements.txt

ENTRYPOINT [ "make", "demo" ]