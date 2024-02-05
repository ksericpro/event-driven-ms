# link
- **[kong] (https://medium.com/@martin.hodges/using-kong-to-access-kubernetes-services-using-a-gateway-resource-with-no-cloud-provided-8a1bcd396be9)

- [debug] (https://copyprogramming.com/howto/error-kubernetes-cluster-unreachable-get-http-localhost-8080-version-timeout-32s-dial-tcp-127-0-0-1-8080-connect-connection-refused)

- [kong plugins] (https://docs.konghq.com/hub/)

- **[install] (https://docs.konghq.com/kubernetes-ingress-controller/latest/install/helm/)

# install Gateway Resources
```We will be using the Gateway resources with Kong. To do this we first need to apply the new Custom Resource Definitions (CRDs) to our cluster that support the GatewayClass and Gateway resources.```

- wget https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml
- microk8s kubectl apply -f standard-install.yaml
- wget https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/experimental-install.yaml
- microk8s kubectl apply -f experimental-install.yaml


# install helm
- ./get_helm.sh

# Install Gateway API
KIC -> Kong Gateway
- kubectl config view --raw > ~/.kube/config

## 1. Install the Gateway API CRDs before installing Kong Ingress Controller.
- kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml

## 2. Create Gateway + GatewayClass interface
- kubectl apply -f kong-gatewayclass.yaml
- kubectl apply -f kong-gateway.yaml
gatewayclass.gateway.networking.k8s.io/kong created
gateway.gateway.networking.k8s.io/kong created

# Install Kong

## 1. Add Helm Charts
- helm repo add kong https://charts.konghq.com
- helm repo update
- helm search repo kong
NAME        	CHART VERSION	APP VERSION	DESCRIPTION                                    
kong/kong   	2.35.0       	3.5        	The Cloud-Native Ingress and API-management    
kong/ingress	0.10.2       	3.4        	Deploy Kong Ingress Controller and Kong Gateway

## 2. Install Kong Ingress Controller and Kong Gateway with Helm
- helm install kong kong/ingress -n kong --create-namespace 

# Test Connectivity with Kong

## 1. Populate $PROXY_IP for future commands:
- export PROXY_IP=$(kubectl get svc --namespace kong kong-gateway-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
- echo $PROXY_IP

## 2. Ensure that you can call the proxy IP:
- curl -i $PROXY_IP
HTTP/1.1 404 Not Found
Date: Sun, 04 Feb 2024 01:57:10 GMT
Content-Type: application/json; charset=utf-8
Connection: keep-alive
Content-Length: 103
X-Kong-Response-Latency: 0
Server: kong/3.5.0
X-Kong-Request-Id: 4d98c46e773d3523c41bb97fa9822f5f

{
  "message":"no Route matched with those values",
  "request_id":"4d98c46e773d3523c41bb97fa9822f5f"
}

# Service & Route

## 1. Deploy Echo Service
- kubectl apply -f https://docs.konghq.com/assets/kubernetes-ingress-controller/examples/echo-service.yaml
service/echo created
deployment.apps/echo created

## 2. Deploy Routes and Ingress
- cd echo
- kubectl apply -f .
httproute.gateway.networking.k8s.io/echo created

## 3. Test Route
- curl -i $PROXY_IP/echo
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 147
Connection: keep-alive
Date: Sun, 04 Feb 2024 02:25:59 GMT
X-Kong-Upstream-Latency: 2
X-Kong-Proxy-Latency: 2
Via: kong/3.5.0
X-Kong-Request-Id: 55ee7c05769e8047700ac655ea001826

Welcome, you are connected to node zackary-latitude-5480.
Running on Pod echo-965f7cf84-wcmvt.
In namespace default.
With IP address 10.1.97.241.


# Rate Limit

## 1. Create
- cd plugins
- kubectl apply -f rate-limit.yaml
kongplugin.configuration.konghq.com/rate-limit-5-min created
- kubectl get KongPlugin
NAME               PLUGIN-TYPE     AGE   PROGRAMMED
rate-limit-5-min   rate-limiting   17s

## Associate with Service or Route
- kubectl annotate service echo konghq.com/plugins=rate-limit-5-min
- kubectl annotate httproute echo konghq.com/plugins=rate-limit-5-min

## Test Rate-limit
- for i in `seq 60`; do curl -sv $PROXY_IP/echo 2>&1 | grep "< HTTP"; done
< HTTP/1.1 429 Too Many Requests
< HTTP/1.1 429 Too Many Requests
< HTTP/1.1 429 Too Many Requests
< HTTP/1.1 429 Too Many Requests
< HTTP/1.1 429 Too Many Requests
< HTTP/1.1 429 Too Many Requests


# Caching

## 1. Create
- cd plugins
- kubectl apply -f caching.yaml
kongclusterplugin.configuration.konghq.com/proxy-cache-all-endpoints created

## Test Caching
- for i in `seq 6`; do curl -sv $PROXY_IP/echo 2>&1 | grep -E "(Status|< HTTP)"; done
"(Status|< HTTP)"; done
< HTTP/1.1 200 OK
< X-Cache-Status: Miss
< HTTP/1.1 200 OK
< X-Cache-Status: Hit
< HTTP/1.1 200 OK
< X-Cache-Status: Hit
< HTTP/1.1 200 OK
< X-Cache-Status: Hit
< HTTP/1.1 200 OK


# Authentication

## 1. Create
- cd plugins
- kubectl apply -f key-auth.yaml
kongplugin.configuration.konghq.com/key-auth created

## Apply the key-auth plugin to the echo service in addition to the previous rate-limit plugin.
- kubectl annotate service echo konghq.com/plugins=rate-limit-5-min,key-auth --overwrite
service/echo annotated

## Test
- curl -i $PROXY_IP/echo
HTTP/1.1 401 Unauthorized
Date: Mon, 05 Feb 2024 03:05:47 GMT
Content-Type: application/json; charset=utf-8
Connection: keep-alive
WWW-Authenticate: Key realm="kong"
Content-Length: 96
X-Kong-Response-Latency: 2
Server: kong/3.5.0
X-Kong-Request-Id: 637b06508042076cce124a5a1cb28c7c

{
  "message":"No API key found in request",
  "request_id":"637b06508042076cce124a5a1cb28c7c"
}

## Create Secret
- kubectl apply -f secret.yaml
secret/alex-key-auth created

## Create Consumer
- kubectl apply -f consumer.yaml 
kongconsumer.configuration.konghq.com/alex created

## Test Again
- curl -H 'apikey: hello_world' $PROXY_IP/echo
Welcome, you are connected to node zackary-latitude-5480.
Running on Pod echo-965f7cf84-wcmvt.
In namespace default.
With IP address 10.1.97.234.
