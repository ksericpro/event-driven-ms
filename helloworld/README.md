# Links
[Part 1] (https://medium.com/@aedemirsen/kubernetes-and-load-balancing-1-358211fd9faa)
[Use local image] (https://stackoverflow.com/questions/36874880/kubernetes-cannot-pull-local-image)

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
- curl localhost:30008

# Playing with Loadbalancer
- sudo microk8s kubectl apply -f service-loadbalancer.yaml
- sudo microk8s kubectl get svc
  CLUSTER-IP:10.152.183.172   EXTERNAL_IP: 10.64.140.44   PORTS: 80:30008 TCP
- curl localhost:30008

# Step 3 Load Balancing with Kubernetes LoadBalancer Service Type
- sudo microk8s enable ingress
- sudo microk8s kubectl get namespace
- sudo microk8s kubectl apply -f service-ingress.yaml
