# Link
- [*1] (https://www.mohammadfaisal.dev/blog/kubernetes-with-nodejs)
- [Dashboard] (https://www.server-world.info/en/note?os=Ubuntu_22.04&p=microk8s&f=4)
- [k8s] (https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [komposer] (https://kompose.io/)
- [Add Metallb] (https://microk8s.io/docs/addon-metallb)

* Good Ones
- [K8s services] (https://medium.com/@aedemirsen/kubernetes-servis-types-cluster-ip-node-port-loadbalancer-a073b7086a5f)
- [Accessing pods thu services] (https://medium.com/@aedemirsen/kubernetes-and-load-balancing-1-358211fd9faa)
- [Loadbanlancer & Ingress] (https://medium.com/@aedemirsen/kubernetes-loadbalancer-and-ingress-controller-7b448f6314f6)


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

