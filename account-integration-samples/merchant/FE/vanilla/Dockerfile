FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY ./index.html /usr/share/nginx/html/index.tmpl.html
COPY ./entrypoint.sh /
RUN chmod +x entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]