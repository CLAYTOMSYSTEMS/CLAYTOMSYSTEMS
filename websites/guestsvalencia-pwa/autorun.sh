#!/bin/bash
echo "Eliminando TODAS las NetworkPolicies en TODOS los namespaces..."
kubectl delete networkpolicy --all --all-namespaces
echo "✅ Sistema liberado: egress abierto globalmente."
