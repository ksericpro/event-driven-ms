# setup
- Install Kubectl
- curl.exe -LO "https://dl.k8s.io/release/v1.29.0/bin/windows/amd64/kubectl.exe"

- Install AWS CLI

# get user credentials
- aws sts get-caller-identity
- aws sts get-caller-identity --no-verify-ssl

# update eks config to local
- aws eks update-kubeconfig --name eks-citynexus-sandbox
Added new context arn:aws:eks:ap-southeast-1:102426935579:cluster/eks-citynexus-sandbox to C:\Users\kiansengs\.kube\config
  
# get 
- kubectl get service -n ingress-nginx
- kubectl get deployment -n ingress-nginx
- kubectl get pods -n ingress-nginx

# ecr
- aws ecr list-images --repository-name citynexus
- aws ecr get-login-password --region region | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com
- 102426935579.dkr.ecr.ap-southeast-1.amazonaws.com/citynexus:management_v1

# deployment (sillyworld || helloworld)
- kubectl apply -f .\configmap.yaml
- kubectl get configmap -n ms-layer
- kubectl apply -f .\deployment.yaml
- kubectl get deployments -n ms-layer
- kubectl get deployments -l app.kubernetes.io/created-by=eric-see -n ms-layer
- kubectl apply -f .\service.yaml
- kubectl get services -n ms-layer
- kubectl rollout status deployment -n ms-layer
- kubectl describe ingress ms-layer -n ms-layer

# deployment (etc)
- kubectl create namespace common-utils
- kubectl apply -f .
- kubectl get deployments -n common-utils
- kubectl get pods -n common-utils
NAME                        READY   STATUS    RESTARTS   AGE
pgadmin-6475b959d6-7wv6d    1/1     Running   0          14h
postgres-7f98cc9ccf-nbs2v   1/1     Running   0          24s
rabbitmq                    1/1     Running   0          14h
- kubectl get persistentvolumeclaim -n common-utils
- kubectl describe persistentvolumeclaim -n common-utils

# deployment (user-ms)
- kubectl apply -f persistentvolumeclaim.yaml
- kubectl get persistentvolumeclaim -n ms-layer
- kubectl apply -f deployment.yaml
- kubectl get deployments -n ms-layer
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
helloworld   1/1     1            1           25h
sillyworld   1/1     1            1           25h
user-ms      1/1     1            1           54s
- kubectl get pods -n ms-layer
NAME                          READY   STATUS    RESTARTS   AGE
helloworld-598695d7cb-wqg77   1/1     Running   0          25h
sillyworld-7659854b8f-cvhcs   1/1     Running   0          21h
user-ms-8498cbc9d7-k59dg      1/1     Running   0          90s
- kubectl apply -f .\service.yaml
- kubectl get svc -n ms-layer
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
helloworld   ClusterIP   172.20.227.174   <none>        80/TCP    2d
sillyworld   ClusterIP   172.20.92.113    <none>        80/TCP    25h
user-ms      ClusterIP   172.20.12.210    <none>        80/TCP    36s
- kubectl apply -f ingress.yaml
- kubectl describe ingress ms-layer -n ms-layer
Labels:           app.kubernetes.io/created-by=eric-see
Namespace:        ms-layer
Address:          k8s-retailappgroup-51b81dfc7a-662253631.ap-southeast-1.elb.amazonaws.com
Ingress Class:    alb
Default backend:  <default>
Rules:
  Host                     Path  Backends
  ----                     ----  --------
  hello.citynexus-dev.com
                           /helloworld   helloworld:80 (10.43.125.68:8080)
                           /sillyworld   sillyworld:80 (10.43.168.96:8081)
                           /user         user-ms:80 (10.43.168.99:8000)
Annotations:               alb.ingress.kubernetes.io/group.name: retail-app-group
                           alb.ingress.kubernetes.io/healthcheck-path: /
                           alb.ingress.kubernetes.io/listen-ports: [{"HTTPS":443}]
                           alb.ingress.kubernetes.io/target-type: ip
Events:
  Type    Reason                  Age                 From     Message
  ----    ------                  ----                ----     -------
  Normal  SuccessfullyReconciled  18s (x11 over 44h)  ingress  Successfully reconciled

# deployment (notification-ms)
- kubectl apply -f .\persistentvolumeclaim.yaml
- kubectl get deployment -n ms-layer
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
helloworld        1/1     1            1           26h
notification-ms   1/1     1            1           73s
sillyworld        1/1     1            1           26h
user-ms           1/1     1            1           70m
- kubectl get persistentvolumeclaim -n ms-layer
NAME                     STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
notification-ms-claim0   Bound    pvc-a6cdb1aa-014e-4166-bb3e-756d2ceaf3bf   1Gi        RWO            gp2            4m15s
user-ms-claim0           Bound    pvc-f38df108-b659-4a23-acc3-688f72c60030   1Gi        RWO            gp2            72m
- kubectl get pods -n ms-layer
NAME                               READY   STATUS    RESTARTS   AGE
helloworld-598695d7cb-wqg77        1/1     Running   0          26h
notification-ms-648c9b878b-ltl2c   1/1     Running   0          2m21s
sillyworld-7659854b8f-cvhcs        1/1     Running   0          22h
user-ms-79c6c5f98-s6lxc            1/1     Running   0          68m
- kubectl apply -f .\service.yaml
- kubectl get svc -n ms-layer
NAME              TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
helloworld        ClusterIP   172.20.227.174   <none>        80/TCP    2d1h
notification-ms   ClusterIP   172.20.53.74     <none>        80/TCP    32s
sillyworld        ClusterIP   172.20.92.113    <none>        80/TCP    26h
user-ms           ClusterIP   172.20.12.210    <none>        80/TCP    68m
- kubectl apply -f .\ingress.yaml
- kubectl describe ingress ms-layer -n ms-layer
Name:             ms-layer
Labels:           app.kubernetes.io/created-by=eric-see
Namespace:        ms-layer
Address:          k8s-retailappgroup-51b81dfc7a-662253631.ap-southeast-1.elb.amazonaws.com
Ingress Class:    alb
Default backend:  <default>
Rules:
  Host                     Path  Backends
  ----                     ----  --------
  hello.citynexus-dev.com
                           /helloworld     helloworld:80 (10.43.125.68:8080)
                           /sillyworld     sillyworld:80 (10.43.168.96:8081)
                           /user           user-ms:80 (10.43.168.99:8000)
                           /notification   notification-ms:80 (10.43.168.98:8001)
Annotations:               alb.ingress.kubernetes.io/group.name: retail-app-group
                           alb.ingress.kubernetes.io/healthcheck-path: /
                           alb.ingress.kubernetes.io/listen-ports: [{"HTTPS":443}]
                           alb.ingress.kubernetes.io/target-type: ip
Events:
  Type    Reason                  Age                 From     Message
  ----    ------                  ----                ----     -------
  Normal  SuccessfullyReconciled  63s (x12 over 45h)  ingress  Successfully reconciled




# curl 
- curl -k https://hello.citynexus-dev.com
- curl -k https://hello.citynexus-dev.com/helloworld
- curl -k https://hello.citynexus-dev.com/helloworld/ping
- curl -k https://hello.citynexus-dev.com/sillyworld
- curl -k https://hello.citynexus-dev.com/sillyworld/ping
- curl -k https://hello.citynexus-dev.com/user/
- curl -k curl -k https://hello.citynexus-dev.com/user/api/v1
- curl -k https://hello.citynexus-dev.com/user/api/v1/user/ping
- curl -k https://hello.citynexus-dev.com/notification/
- curl -k https://hello.citynexus-dev.com/notification/api/v1
- curl -k https://hello.citynexus-dev.com/notification/api/v1/ping

# references
- [link] (https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)
- [PGDATA] (https://serverfault.com/questions/1018377/postgres-mount-volume-error-in-k8s)
