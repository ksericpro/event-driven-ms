# Link
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

## dashboard
- sudo microk8s enable dashboard dns
- sudo microk8s kubectl get services -n kube-system
[Get Deployment]
[Get IP of kubernetes-dashboard]
- sudo microk8s config | grep token 
[Copy token]
- Open https://[IP], login using token

## Metallb
- sudo microk8s enable metallb:10.64.140.43-10.64.140.49
[Must enable for loadbalancer Service]

## Deploy (etc)
- sudo microk8s kubectl create namespace common-utils
- sudo microk8s kubectl apply -f .

## Deploy (helloworld)
- sudo microk8s kubectl create namespace ms-layer
- sudo microk8s kubectl apply -f .
- sudo microk8s kubectl get deployments -n ms-layer
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
helloworld   1/1     1            1           45s
- sudo microk8s kubectl get pods -n ms-layer
NAME                         READY   STATUS    RESTARTS   AGE
helloworld-c9d489688-xk4bt   1/1     Running   0          56s

## Deploy (sillywork)
- sudo microk8s kubectl apply -f .
- sudo microk8s kubectl get deployments -n ms-layer
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
helloworld   1/1     1            1           5m23s
sillyworld   2/2     2            2           72s
- sudo microk8s kubectl get pods -n ms-layer
NAME                          READY   STATUS    RESTARTS   AGE
helloworld-c9d489688-xk4bt    1/1     Running   0          5m59s
sillyworld-55f79f85b9-n7cvn   1/1     Running   0          108s
sillyworld-55f79f85b9-rqthg   1/1     Running   0          108s

## Deploy (user-ms)
- sudo microk8s kubectl apply -f .
- sudo microk8s kubectl get deployments -n ms-layer
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
helloworld   1/1     1            1           10m
sillyworld   2/2     2            2           6m25s
user-ms      2/2     2            2           24s
- sudo microk8s kubectl get pods -n ms-layer
NAME                          READY   STATUS    RESTARTS   AGE
helloworld-c9d489688-xk4bt    1/1     Running   0          11m
sillyworld-55f79f85b9-n7cvn   1/1     Running   0          7m3s
sillyworld-55f79f85b9-rqthg   1/1     Running   0          7m3s
user-ms-869945f985-z2l2k      1/1     Running   0          62s
user-ms-869945f985-hdzmb      1/1     Running   0          62s

## Deploy (notification-ms)
- sudo microk8s kubectl apply -f .
- sudo microk8s kubectl get deployments -n ms-layer
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
helloworld        1/1     1            1           24m
sillyworld        2/2     2            2           20m
user-ms           2/2     2            2           14m
notification-ms   2/2     2            2           8m30s
- sudo microk8s kubectl get pods -n ms-layer
NAME                              READY   STATUS    RESTARTS      AGE
helloworld-c9d489688-xk4bt        1/1     Running   0             17m
sillyworld-55f79f85b9-n7cvn       1/1     Running   0             13m
sillyworld-55f79f85b9-rqthg       1/1     Running   0             13m
user-ms-c4997778f-tgmsj           1/1     Running   0             74s
user-ms-c4997778f-fhtwd           1/1     Running   0             74s
notification-ms-c88b6cb8c-mczb9   1/1     Running   3 (42s ago)   2m2s
notification-ms-c88b6cb8c-9xjgq   1/1     Running   3 (39s ago)   2m2s

## final
- sudo microk8s kubectl get svc -n ms-layer
NAME              TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)        AGE
sillyworld        ClusterIP      10.152.183.107   <none>         80/TCP         49m
user-ms           LoadBalancer   10.152.183.69    10.64.140.48   80:30101/TCP   43m
notification-ms   LoadBalancer   10.152.183.208   10.64.140.49   80:30111/TCP   38m


## Deploy (ingress)
- sudo microk8s kubectl apply -f .
- sudo microk8s kubectl get ingress -A
NAMESPACE   NAME            CLASS    HOSTS   ADDRESS   PORTS   AGE
ms-layer    nginx-ingress   public   *                 80      6s
- sudo microk8s kubectl describe ingress nginx-ingress -n ms-layer
Name:             nginx-ingress
Labels:           <none>
Namespace:        ms-layer
Address:          127.0.0.1
Ingress Class:    public
Default backend:  <default>
Rules:
  Host        Path  Backends
  ----        ----  --------
  *           
              /helloworld(/|$)(.*)   helloworld:80 (<error: endpoints "helloworld" not found>)
              /sillyworld            sillyworld:80 (10.1.97.202:8081,10.1.97.241:8081)
              /user                  user-ms:80 (10.1.97.211:8000,10.1.97.250:8000)
              /notification          notification-ms:80 ()
Annotations:  nginx.ingress.kubernetes.io/cors-allow-credentials: true
              nginx.ingress.kubernetes.io/cors-allow-methods: GET, PUT, POST, DELETE, OPTIONS
              nginx.ingress.kubernetes.io/cors-allow-origin: $http_origin
              nginx.ingress.kubernetes.io/enable-cors: true
              nginx.ingress.kubernetes.io/ssl-redirect: false
Events:
  Type    Reason  Age                From                      Message
  ----    ------  ----               ----                      -------
  Normal  Sync    37s (x6 over 16m)  nginx-ingress-controller  Scheduled for sync
    
## other command
- sudo microk8s kubectl rollout restart -n default deployment user-ms

## Accessing Frontend services
- sudo microk8s kubectl get services
    [copy cluster ip]
    http://10.152.183.84:8001/api/v1/

# Create/Update service + deployment using komposer.io
- kompose convert -f docker-compose.yml
- sudo microk8s kubectl apply -f .
- changes
    replicas: 2
    comment #hostPort: 8000

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
