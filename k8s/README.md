# Link
- [*1] (https://www.mohammadfaisal.dev/blog/kubernetes-with-nodejs)
- [*2] (https://www.cortex.io/post/understanding-kubernetes-services-ingress-networking)
(https://www.cortex.io/post/beginners-guide-to-kubernetes)
- [3] (https://learnk8s.io/kubernetes-ingress-api-gateway)
- [k8s tutorials] (https://kubernetes.io/docs/tasks/access-application-cluster/connecting-frontend-backend/)
- [dockerhub] (https://jsta.github.io/r-docker-tutorial/04-Dockerhub.html)
- [Micork8s] (https://thenewstack.io/deploy-a-single-node-kubernetes-instance-in-seconds-with-microk8s/)
- [Dashboard] (https://www.server-world.info/en/note?os=Ubuntu_22.04&p=microk8s&f=4)
- [k8s] (https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [komposer] (https://kompose.io/)
- [Add Metallb] (https://microk8s.io/docs/addon-metallb)
- [k8s ingress + Load Balance] (https://medium.com/@aedemirsen/kubernetes-loadbalancer-and-ingress-controller-7b448f6314f6)

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

# Metallb
- sudo microk8s enable metallb:10.64.140.43-10.64.140.49
[Must enable for loadbalancer Service]

## Deploy
- sudo microk8s.kubectl get all --all-namespaces
- sudo microk8s.kubectl create -f deployment-user-ms.yml
- sudo microk8s kubectl get deployments
- sudo microk8s kubectl get pods
- sudo microk8s kubectl describe pods
- sudo microk8s kubectl get namespaces
- sudo microk8s kubectl delete -n default deployment microbot

## dashboard
- sudo microk8s enable dashboard dns
- sudo microk8s kubectl get services -n kube-system
[Get Deployment]
[Get IP of kubernetes-dashboard]
- sudo microk8s config | grep token 
[Copy token]
- Open https://[IP], login using token

## Create/Update service + deployment using komposer.io
- kompose convert -f docker-compose.yml
- sudo microk8s kubectl apply -f .
- changes
    replicas: 2
    comment #hostPort: 8000
    
## restart pods
- sudo microk8s kubectl rollout restart -n default deployment user-ms

## Accessing Frontend services
- sudo microk8s kubectl get services
    [copy cluster ip]
    http://10.152.183.84:8001/notification/api/v1/

