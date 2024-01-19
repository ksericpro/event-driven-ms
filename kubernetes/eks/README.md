# setup
- Install Kubectl
- curl.exe -LO "https://dl.k8s.io/release/v1.29.0/bin/windows/amd64/kubectl.exe"

- Install AWS CLI

# sso 
- https://d-9667063f4b.awsapps.com/start#/

# configure credentials
- aws configure sso
    > sso_start_url:https://d-9667063f4b.awsapps.com/start#
    > sso_region:ap-southeast-1


# set temporary keys to enviroment
$Env:AWS_ACCESS_KEY_ID="ASIARPWI7AENQ6NP6F7O"
$Env:AWS_SECRET_ACCESS_KEY="53k4yZIUyJY8K9gAG6u6r4i7XVBH/2Emw1loJPxY"
$Env:AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEDQaDmFwLXNvdXRoZWFzdC0xIkYwRAIgcSkOKUOTdb/uZuaWxeqQSLpGclOBfE5c9iSuKuQ2OMsCIBhyq5neZhV3ZmvT5V0ndDTFSrf0czVDm5qSoRQkHA0TKo0DCM3//////////wEQAhoMMTAyNDI2OTM1NTc5IgxS1ojYE9Qnjdz3M8cq4QKdSf3/Ub1ECR0zFP+1o51E6xdROKEfIUQtygQUJuxDwQgYFsrEfY/rUZde2Km7jILOaPzAyC4Pq7dGvvItyGgAt2XSGB6WnDobRyjfss5YC9dhTGdkuARsQWmNcQwATyveWxacj9G0vJgdfr8dYR2StnF7fhNhdBNx6k00qlv2kApUdHPmdeguSSRNkUkC7S8qiG7qHBGXulrmepdT/51KITt/owAVEhlUBRm1Uw13IvYB33akotquXMlLukuyILh+o7/2MZrWgh7vouJvvrou2pWu+Jen2pjIesgS6OVjs2h2p+MtxmJM5kCpQRSYCgJPa/kwNt4MnSIkZ7v/Ry4jbe7EGV1Mc52YI/VCpTLzaKP1mQS5696TYDA9llXccLMkxltdoXzajHGHZEIMzvjrvEyCE0V3UeTFvZ1FoOn0LCwR4aXUbAVjdJCyF8wJC7t5X9VxcR1dUjCcfJCRGmf3FjDj7e2sBjqnAWzMrUWOKTC3ihOZOhvkCQglpFA+y6oorNutYcpjfN+xWYMEprz4MkRp4spcQe3pcWLhM7lNim2+cfn7tlOadgBRVIpeCk/yqSlf+sYBQN4kKN8TMq06QcSvIajLpuWHRNIaMKWVdRRLYrfTYTyofsbgszgiK28yUKWHjUZhxBGKGl9AaJDS2v8Psp/vjcMtyJhxEQ2+4Gp+7Q0IjN2HfIR+rrmV6eFK"

# get user credentials
- aws sts get-caller-identity
- aws sts get-caller-identity --no-verify-ssl

# update eks config to local
- aws eks update-kubeconfig --name eks-citynexus-sandbox
Added new context arn:aws:eks:ap-southeast-1:102426935579:cluster/eks-citynexus-sandbox to C:\Users\kiansengs\.kube\config

# get namespace
- kubectl get namespaces
NAME              STATUS   AGE
assets            Active   38m
carts             Active   38m
catalog           Active   38m
checkout          Active   38m
default           Active   100m
kube-node-lease   Active   100m
kube-public       Active   100m
kube-system       Active   100m
orders            Active   38m
other             Active   38m
rabbitmq          Active   38m
ui                Active   

# ingress
- kubectl get ingress -A
NAMESPACE   NAME      CLASS   HOSTS   ADDRESS                                                                     PORTS   AGE
catalog     catalog   alb     *       k8s-retailappgroup-51b81dfc7a-1242021702.ap-southeast-1.elb.amazonaws.com   80      32m
ui          ui        alb     *       k8s-retailappgroup-51b81dfc7a-1242021702.ap-southeast-1.elb.amazonaws.com   80      32m

- kubectl describe ingress catalog -n catalog
Name:             catalog
Labels:           app.kubernetes.io/created-by=eks-workshop
Namespace:        catalog
Address:          k8s-retailappgroup-51b81dfc7a-1242021702.ap-southeast-1.elb.amazonaws.com
Ingress Class:    alb
Default backend:  <default>
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /catalogue   catalog:80 (10.43.160.116:8080)
Annotations:  alb.ingress.kubernetes.io/group.name: retail-app-group
              alb.ingress.kubernetes.io/healthcheck-path: /health
              alb.ingress.kubernetes.io/target-type: ip
Events:
  Type     Reason                  Age                From     Message
  ----     ------                  ----               ----     -------
  Warning  FailedBuildModel        34m                ingress  Failed build model due to couldn't auto-discover subnets: unable to resolve at least one subnet (0 match VPC and tags)
  Normal   SuccessfullyReconciled  34m (x2 over 34m)  ingress  Successfully reconciled

- kubectl describe ingress ui -n ui
Name:             ui
Labels:           app.kubernetes.io/created-by=eks-workshop
Namespace:        ui
Address:          k8s-retailappgroup-51b81dfc7a-1242021702.ap-southeast-1.elb.amazonaws.com
Ingress Class:    alb
Default backend:  <default>
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /   ui:80 (10.43.185.56:8080)
Annotations:  alb.ingress.kubernetes.io/group.name: retail-app-group
              alb.ingress.kubernetes.io/healthcheck-path: /actuator/health/liveness
              alb.ingress.kubernetes.io/scheme: internet-facing
              alb.ingress.kubernetes.io/target-type: ip
Events:
  Type    Reason                  Age                From     Message
  ----    ------                  ----               ----     -------
  Normal  SuccessfullyReconciled  35m (x2 over 35m)  ingress  Successfully reconciled
  
# get 
- kubectl get service -n ingress-nginx
- kubectl get deployment -n ingress-nginx
- kubectl get pods -n ingress-nginx

# get nodes of cluster
- kubectl get nodes
NAME                                               STATUS   ROLES    AGE   VERSION
ip-10-43-124-116.ap-southeast-1.compute.internal   Ready    <none>   41d   v1.27.7-eks-e71965b
ip-10-43-133-151.ap-southeast-1.compute.internal   Ready    <none>   41d   v1.27.7-eks-e71965b

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
