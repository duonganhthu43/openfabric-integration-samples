FROM nginx:alpine
COPY . /usr/share/nginx/html
RUN echo $(ls -1 .)
COPY ./account-fe.html /usr/share/nginx/html/index.tmpl.html
COPY ./entrypoint.sh /
RUN chmod +x entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]