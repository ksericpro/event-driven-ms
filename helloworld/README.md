# Links
[Use local image] (https://stackoverflow.com/questions/36874880/kubernetes-cannot-pull-local-image)

[compare service type] (https://kodekloud.com/blog/clusterip-nodeport-loadbalancer/)

* Good Ones
- [K8s services] (https://medium.com/@aedemirsen/kubernetes-servis-types-cluster-ip-node-port-loadbalancer-a073b7086a5f)
- [Accessing pods thu services] (https://medium.com/@aedemirsen/kubernetes-and-load-balancing-1-358211fd9faa)
- [Loadbanlancer & Ingress] (https://medium.com/@aedemirsen/kubernetes-loadbalancer-and-ingress-controller-7b448f6314f6)
- [Test ingress] (https://phoenixnap.com/kb/microk8s-ingress)

# Step 1. Project Structure and Creating the Backend Project
- npm install
- npm start
- curl localhost:8080
    This is the server's response…
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


- sudo microk8s kubectl describe ingress nginx-ingress-example -n ingress-nginx
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
nginx-ingress-example   public   *  127.0.0.1   80      6m18s

- curl 127.0.0.1