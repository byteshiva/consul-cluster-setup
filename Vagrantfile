# -*- mode: ruby -*-
# vi: set ft=ruby :
$script = <<SCRIPT

echo Installing dependencies...
sudo apt-get update
sudo apt-get install -y unzip curl nmap

echo Fetching Consul...
cd /tmp/
curl https://releases.hashicorp.com/consul/0.6.4/consul_0.6.4_linux_amd64.zip -o consul.zip

echo Installing Consul...
unzip consul.zip
sudo chmod +x consul
sudo mv consul /usr/bin/consul

sudo mkdir /etc/consul.d
sudo chmod a+w /etc/consul.d

SCRIPT

$multi-check-service = <<SCRIPT

echo adding multi-check-serivce for service running on port 80...
echo '{"services":[{"id":"webservice-poll","name":"webservice-poll","tags":["poll"],"port":80,"checks":[{"name":"Sys check ","script":"some_scripts.sh param1 param2","interval":"5s","timeout":"1s"},{"name":"Check if service is alive","http":"http://localhost:80/checkservice","interval":"5s","timeout":"1s"},{"name":"HTTP on port 80","http":"http://localhost:80/","interval":"5s","timeout":"1s"},{"id":"check particular tcp port","name":"check a port","tcp":"localhost:3415","interval":"10s","timeout":"1s"}]}]}' > /etc/consul.d/checkbservice.json

echo '{"service": {"name": "web", "tags": ["rails"], "port": 80,"check": {"script": "curl localhost >/dev/null 2>&1", "interval": "10s"}}}' > /etc/consul.d/web.json

SCRIPT

UDP_PORTS_LIST={
  "8500" => 8500 # Rest Service
}

TCP_PORTS_LIST={
  "8600" => 8600 # Alternate port for DNS
}

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
# Create three nodes 
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "debian/wheezy64"

  config.vm.provision "shell", inline: $script

  config.vm.define "node1" do |node1|
      node1.vm.hostname = "node1"
      node1.vm.network "private_network", ip: "172.20.20.10"
      UDP_PORTS_LIST.each do |guest, host|
	      node1.vm.network "forwarded_port", guest: "#{guest}", host: "#{host}", protocol: "udp"
      end
      TCP_PORTS_LIST.each do |guest, host|
	      node1.vm.network "forwarded_port", guest: "#{guest}", host: "#{host}", protocol: "tcp"
      end
      #node1.vm.network "forwarded_port", guest: 8500, host: 8500
      #node1.vm.network "forwarded_port", guest: 8600, host: 8600
  end

  config.vm.define "node2" do |node2|
      node2.vm.hostname = "node2"
      node2.vm.network "private_network", ip: "172.20.20.11"
      node2.vm.provision "shell", inline: $multi-check-service
  end

  config.vm.define "node3" do |node3|
      node3.vm.hostname = "node3"
      node3.vm.network "private_network", ip: "172.20.20.12"
  end
end
