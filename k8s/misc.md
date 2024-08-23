todo: config-sync for this kind of stuff

helm repo add external-secrets https://charts.external-secrets.io

helm install external-secrets \
 external-secrets/external-secrets \
 -n external-secrets \
 --create-namespace \
 --set installCRDs=true



allows us to control the lb in terraform
https://cloud.google.com/kubernetes-engine/docs/how-to/standalone-neg

https://www.googlecloudcommunity.com/gc/Community-Blogs/Multi-cluster-load-balancing-with-GKE-using-standalone-network/ba-p/636021
