# Link
- [1] (https://www.mohammadfaisal.dev/blog/kubernetes-with-nodejs)
- [2] (https://www.cortex.io/post/understanding-kubernetes-services-ingress-networking)
- [3] (https://learnk8s.io/kubernetes-ingress-api-gateway)
- [dockerhub] (https://jsta.github.io/r-docker-tutorial/04-Dockerhub.html)
- [Micork8s] (https://thenewstack.io/deploy-a-single-node-kubernetes-instance-in-seconds-with-microk8s/)
- [Dashboard] (https://www.server-world.info/en/note?os=Ubuntu_22.04&p=microk8s&f=4)
- [k8s] (https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

# Setup DockerHub
- docker login --username ksericpro 
    Create repository "notification-ms" in dockerhub
    docker tag local-image:tagname new-repo:tagname
    docker push new-repo:tagname

- docker tag 632c16ec44f7 ksericpro/notification-ms:1.0.0
- docker push ksericpro/notification-ms:1.0.0
- docker save ksericpro/notification-ms:1.0.0 > test.tar
- docker load --input test.tar

# Microk8s

## Deploy
- sudo microk8s.kubectl get all --all-namespaces
- sudo microk8s.kubectl create -f deployment-user-ms.yml
- sudo microk8s kubectl get deployments
- sudo microk8s kubectl get pods
- sudo microk8s kubectl describe pods
- sudo microk8s kubectl get namespaces
- sudo microk8s kubectl delete -n default deployment microbot

### dashboard
- sudo microk8s enable dashboard dns
- sudo microk8s kubectl get services -n kube-system
[Get Deployment]
[Get IP of kubernetes-dashboard]
- microk8s config | grep token 
[Copy token]
- Open IP:443, login using token