# Link
- [*1] (https://www.mohammadfaisal.dev/blog/kubernetes-with-nodejs)
- [Dashboard] (https://www.server-world.info/en/note?os=Ubuntu_22.04&p=microk8s&f=4)
- [k8s] (https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [komposer] (https://kompose.io/)
- [Add Metallb] (https://microk8s.io/docs/addon-metallb)
- [Use local image] (https://stackoverflow.com/questions/36874880/kubernetes-cannot-pull-local-image)
- [compare service type] (https://kodekloud.com/blog/clusterip-nodeport-loadbalancer/)

* Good Ones
- [K8s services] (https://medium.com/@aedemirsen/kubernetes-servis-types-cluster-ip-node-port-loadbalancer-a073b7086a5f)
- [Accessing pods thu services] (https://medium.com/@aedemirsen/kubernetes-and-load-balancing-1-358211fd9faa)
- [Loadbanlancer & Ingress] (https://medium.com/@aedemirsen/kubernetes-loadbalancer-and-ingress-controller-7b448f6314f6)
- [Test ingress] (https://phoenixnap.com/kb/microk8s-ingress)
- [Ingress] (https://stackoverflow.com/questions/70795048/kubernetes-multiple-path-rewrites)
- [link] (https://stackoverflow.com/questions/58009551/kubernetes-how-to-allow-two-pods-running-in-same-different-namespace-communicat)

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
    http://10.152.183.84:8001/api/v1/


# Helloworld Deplomyment

# Step 1. Project Structure and Creating the Backend Project
- npm install
- npm start
- curl localhost:8080
    This is the server's hello response…
- docker build -t backend:0.1 .
- docker tag 04f215f83773 ksericpro/backend:1.0.0
- docker login
- docker push ksericpro/backend:1.0.0
- sudo microk8s kubectl apply -f backend-deployment.yaml
- sudo microk8s kubectl get deployments
- sudo microk8s kubectl get pods

# Step 2. Accessing Pods with ClusterIP Service
- sudo microk8s kubectl apply -f service-clusterip.yaml
- sudo microk8s kubectl get svc
  CLUSTER-IP:10.152.183.172   PORT(S): 80 TCP
- curl 10.152.183.172:80
    This is the server's response…


# Playing with NodePort
- ClusterIP (default) -> NodePort -> Loadbalancer
- sudo microk8s kubectl apply -f service-nodeport.yaml
- sudo microk8s kubectl get svc
  CLUSTER-IP:10.152.183.172   PORT(S): 80:30008 TCP
- curl 10.152.183.172:80
- curl localhost:30008

# Playing with Loadbalancer
- sudo microk8s kubectl apply -f service-loadbalancer.yaml
- sudo microk8s kubectl get svc
  CLUSTER-IP:10.152.183.172   EXTERNAL_IP: 10.64.140.44   PORTS: 80:30008 TCP
- curl 10.152.183.172:80
- curl 10.64.140.44:80
- curl localhost:30008

# Step 3 Load Balancing with Kubernetes LoadBalancer Service Type
- sudo microk8s enable ingress
- sudo microk8s kubectl get namespace
- sudo microk8s kubectl create namespace ingress-nginx
- sudo microk8s kubectl delete svc backend-service
- sudo microk8s kubectl apply -f backend-deployment.yaml
- sudo microk8s kubectl apply -f service-ingress.yaml
- sudo microk8s kubectl apply -f ingress.yaml

- sudo microk8s kubectl get pods -n ingress-nginx
NAME                                  READY   STATUS    RESTARTS   AGE
backend-deployment-7c67cf7596-xvw2q   1/1     Running   0          6m29s
backend-deployment-7c67cf7596-65wwb   1/1     Running   0          6m28s
backend-deployment-7c67cf7596-fwwdh   1/1     Running   0          6m28s
backend-deployment-7c67cf7596-dcqsc   1/1     Running   0          6m28s


- sudo microk8s kubectl get svc -n ingress-nginx
NAME              TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)        
backend-service   LoadBalancer   10.152.183.131   10.64.140.44   80:30008/TCP 

- curl 10.64.140.44
- curl 10.152.183.131


- sudo microk8s kubectl describe ingress nginx-ingress -n ingress-nginx
Name:             nginx-ingress-example
Labels:           <none>
Namespace:        ingress-nginx
Address:          127.0.0.1
Ingress Class:    public
Default backend:  <default>
Rules:
  Host             Path  Backends
  ----             ----  --------
  www.example.com  
                   /   backend-service:80 (10.1.97.201:8080,10.1.97.213:8080,10.1.97.218:8080 + 1 more...)
Annotations:       nginx.ingress.kubernetes.io/rewrite-target: /
Events:
  Type    Reason  Age                    From                      Message
  ----    ------  ----                   ----                      -------
  Normal  Sync    4m16s (x2 over 4m40s)  nginx-ingress-controller  Scheduled for sync

- curl 10.1.97.213:8080
- curl 10.1.97.201:8080
- curl 10.1.97.218:8080

- sudo microk8s kubectl get ingress -n ingress-nginx
NAME                    CLASS    HOSTS             ADDRESS     PORTS   AGE
nginx-ingress-helloworld   public   *  127.0.0.1   80      6m18s

- curl 127.0.0.1

# rerollout deployment
- sudo microk8s kubectl rollout restart deployment -n ingress-nginx

# user-ms + notification-ms

 - curl 10.152.183.44:8000/api/v1
 - sudo microk8s kubectl get svc -n ingress-nginx
NAME                      TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)          AGE
helloworld-service        LoadBalancer   10.152.183.63    10.64.140.43   80:30008/TCP     3d2h
sillyworld-service        LoadBalancer   10.152.183.20    10.64.140.44   80:30009/TCP     3d2h
user-ms-service           LoadBalancer   10.152.183.78    10.64.140.45   8000:30010/TCP   130m
notification-ms-service   LoadBalancer   10.152.183.118   10.64.140.46   8001:30011/TCP   10m

- sudo microk8s kubectl describe ingress nginx-ingress-user-ms -n ingress-nginx
- sudo microk8s kubectl get ingress -n ingress-nginx

# update ingress
- sudo microk8s kubectl apply -f ingress.yaml

# Get all pods namespace
- sudo microk8s kubectl get pods -o wide --all-namespaces

# Get logs
- sudo microk8s kubectl logs [pod] -n [namespace]

# Get Env
- sudo microk8s kubectl exec [pod] printenv

# inter service communications
- <service-name>.<service-namespace>.svc.cluster.local
