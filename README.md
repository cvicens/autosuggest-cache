export PROJECT_NAME="autosuggest"
export PROJECT_ID="autosuggest-194816"
export IMAGE_NAME="autosuggest-cache"
export CONTAINER_NAME="autosuggest-cache"

export IMAGE_VERSION="v0.1.1" ; git commit -a -m "init" ;git tag -a ${IMAGE_VERSION} -m "version ${IMAGE_VERSION}" ; git push origin master ${IMAGE_VERSION}

docker build -t eu.gcr.io/$PROJECT_ID/$IMAGE_NAME:$IMAGE_VERSION .

docker run -it --rm -p 8080:8080 --name $CONTAINER_NAME eu.gcr.io/$PROJECT_ID/$IMAGE_NAME:$IMAGE_VERSION

git tag -a ${IMAGE_VERSION} -m "version ${IMAGE_VERSION}" ; git push origin master ${IMAGE_VERSION}

# Optional if trigger in GCE Builder
gcloud docker -- push eu.gcr.io/$PROJECT_ID/$IMAGE_NAME:$IMAGE_VERSION

