# consul-cluster-setup
setup consul cluster setup

# In Node two follow the below instructions

```bash
$sudo -s
$ echo '{"service": {"name": "web", "tags": ["rails"], "port": 80,
  "check": {"script": "curl localhost >/dev/null 2>&1", "interval": "10s"}}}' > /etc/consul.d/web.json 
  
$ echo '{"services":[{"id":"webservice-poll","name":"webservice-poll","tags":["poll"],"port":80,"checks":[{"name":"Sys check ","script":"some_scripts.sh param1 param2","interval":"5s","timeout":"1s"},{"name":"Check if service is alive","http":"http://localhost:80/checkservice","interval":"5s","timeout":"1s"},{"name":"HTTP on port 80","http":"http://localhost:80/","interval":"5s","timeout":"1s"},{"id":"check particular tcp port","name":"check a port","tcp":"localhost:3415","interval":"10s","timeout":"1s"}]}]}' > /etc/consul.d/checkbservice.json


```

# Run Node1 as Server

```bash
$consul agent -server -bootstrap-expect 1 -data-dir /tmp/consul -node=agent-one -bind=172.20.20.10 -client=0.0.0.0 -config-dir /etc/consul.d/ -ui
```
*172.20.20.10 - private ipaddress of node1 
*bootstrap-expect [num] - num tells the server that it expect atleast one node to join.
*consul can run either as server or agent, -server makes the consul agent as server
*-node gives a name to identify the node

Notes:
Expose client = 0.0.0.0 inorder to accomplish [port forwarding to localhost](https://groups.google.com/forum/#!topic/vagrant-up/Gk7brIps2_8)


# Run Node2 as client and join to cluster
```bash
$consul agent --data-dir /tmp/consul -node=agent-two -bind=172.20.20.11 -config-dir /etc/consul.d/
```
Note
* 172.20.20.11 - private ip address of node2
* -bind telling consul to bind the localip address, so while advertising itself it will use this ipaddress. Can also see -advertise or -advertise-wan
* --data-dir  - tells the consul to refer or store all intermediate meta-datas for the consul
* 

# Join Node2 from node1

```bash
Login to machine one - ie, node

$vagrant ssh node1
node1@$consul members 
node1@$consul join 172.20.20.11
```

The join command will make the node join to cluster and election process happens to elect cluster leader.


#Run Node3 as client and join to cluster
```bash
$consul agent --data-dir /tmp/consul -node=agent-three -bind=172.20.20.12 -config-dir /etc/consul.d/
```
* 172.20.20.12 - local private ipaddres of node3
* node = agent-three, this is used to identify node3 among other nodes in cluster.
* 
#join node3 to cluster 

```bash 
$vagrant ssh node1
node1@$consul members 
node1@$consul join 172.20.20.12
```

* note the node can join to any member in the cluster, its not mandatory to join from server node.




