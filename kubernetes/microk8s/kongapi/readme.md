# link
[kong] (https://medium.com/@martin.hodges/using-kong-to-access-kubernetes-services-using-a-gateway-resource-with-no-cloud-provided-8a1bcd396be9)

[minikube] (https://medium.com/project44-techblog/implementing-kong-gateway-on-k8s-260ec345198f)

[debug] (https://copyprogramming.com/howto/error-kubernetes-cluster-unreachable-get-http-localhost-8080-version-timeout-32s-dial-tcp-127-0-0-1-8080-connect-connection-refused)

[kong] (https://docs.konghq.com/kubernetes-ingress-controller/latest/reference/annotations/)

[kong plugins] (https://docs.konghq.com/hub/)

# install Gateway Resources
```We will be using the Gateway resources with Kong. To do this we first need to apply the new Custom Resource Definitions (CRDs) to our cluster that support the GatewayClass and Gateway resources.```

- wget https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml
- microk8s kubectl apply -f standard-install.yaml
- wget https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/experimental-install.yaml
- microk8s kubectl apply -f experimental-install.yaml

# Gateway Class
- sudo microks8 kubectl create namespace kong
- sudo microk8s kubectl apply -f kong-gw-class.yml 

# install helm
- ./get_helm.sh

# install kong Custom Resource Definitions (CRDs)
- wget https://github.com/Kong/kubernetes-ingress-controller/config/crd
- sudo microk8s kubectl apply -k https://github.com/Kong/kubernetes-ingress-controller/config/crd
- /snap/microk8s/current/kubectl kustomize https://github.com/Kong/kubernetes-ingress-controller/config/crd

# Kong Application
Kong Ingress Controller (KIC) — converts Kubernetes resource definitions into Kong Gateway configurations
Kong Gateway — acts as the router to the services based on configuration inserted by the Kong Ingress Controller (KIC)

- helm repo add kong https://charts.konghq.com
- helm repo update
- helm search repo kong
NAME        	CHART VERSION	APP VERSION	DESCRIPTION                                    
kong/kong   	2.35.0       	3.5        	The Cloud-Native Ingress and API-management    
kong/ingress	0.10.2       	3.4        	Deploy Kong Ingress Controller and Kong Gateway

- [microk8s] kubectl config view --raw > ~/.kube/config
- helm install kong kong/ingress -f kong-values.yaml -n kong

WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /home/ericsee/.kube/config
WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /home/ericsee/.kube/config
NAME: kong
LAST DEPLOYED: Sat Feb  3 18:27:01 2024
NAMESPACE: kong
STATUS: deployed
REVISION: 1
TEST SUITE: None

- [microk8s] kubectl get all -n kong

NAME                                  READY   STATUS    RESTARTS   AGE
pod/kong-gateway-7cf546f784-zbfxn     1/1     Running   0          101s
pod/kong-controller-69b6d7865-ljll7   1/1     Running   0          101s

NAME                                         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                         AGE
service/kong-gateway-admin                   ClusterIP   None             <none>        8001/TCP,8444/TCP               103s
service/kong-controller-validation-webhook   ClusterIP   10.152.183.68    <none>        443/TCP                         103s
service/kong-gateway-manager                 NodePort    10.152.183.239   <none>        8002:30468/TCP,8445:30211/TCP   103s
service/kong-gateway-proxy                   NodePort    10.152.183.54    <none>        80:32001/TCP                    103s

NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/kong-gateway      1/1     1            1           102s
deployment.apps/kong-controller   1/1     1            1           102s

NAME                                        DESIRED   CURRENT   READY   AGE
replicaset.apps/kong-gateway-7cf546f784     1         1         1       102s
replicaset.apps/kong-controller-69b6d7865   1         1         1       102s

- curl localhost:32001
{
  "message":"no Route matched with those values",
  "request_id":"7fc9db053e3029105581890e81effe12"
}

# Adding Routes
-

# Tutorial #2
Use helm chart to install Kong

## clean up
- helm uninstall kong
- [microk8s] kubectl get IngressClass

## install
- [microk8s] kubectl config view --raw > ~/.kube/config
- chmod o-r ~/.kube/config
- chmod g-r ~/.kube/config
- helm dep up ./helm/kong$ 
- helm install kong ./helm/kong
- [microk8s] kubectl get IngressClass
NAME     CONTROLLER                            PARAMETERS   AGE
public   k8s.io/ingress-nginx                  <none>       38d
nginx    k8s.io/ingress-nginx                  <none>       38d
kong     ingress-controllers.konghq.com/kong   <none>       8s
