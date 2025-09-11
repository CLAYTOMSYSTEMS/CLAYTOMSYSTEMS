#!/usr/bin/env bash
    set -euo pipefail
    echo "ClayTom Systems — Despliegue 500,000 Marketing Agents"
    date

    NAMESPACE="prod/agents/marketing"
    TEMPLATE="master_template.json"

    echo "[1/5] Crear 4 cohorts de 125k lógicos cada uno"
    ctsctl agents create --template {"role":"content_creator"} --from-file content_creator.json --count 125000 --namespace $NAMESPACE/content_creator
    ctsctl agents create --template {"role":"social_manager"}  --from-file social_manager.json  --count 125000 --namespace $NAMESPACE/social_manager
    ctsctl agents create --template {"role":"performance_marketer"} --from-file performance_marketer.json --count 125000 --namespace $NAMESPACE/performance_marketer
    ctsctl agents create --template {"role":"audiovisual_producer"} --from-file audiovisual_producer.json --count 125000 --namespace $NAMESPACE/audiovisual_producer

    echo "[2/5] Vincular conocimiento y herramientas"
    ctsctl knowledge apply --namespace $NAMESPACE --file knowledge_collections.yaml
    ctsctl tools apply --namespace $NAMESPACE --file tools.yaml

    echo "[3/5] Activar observabilidad"
    ctsctl observability enable --namespace $NAMESPACE --logs --metrics --trace

    echo "[4/5] Smoke tests"
    ctsctl agents test --namespace $NAMESPACE/content_creator --scenario content_creator.reel_30s_es --scenarios-file qa_scenarios.json
    ctsctl agents test --namespace $NAMESPACE/social_manager --scenario social_manager.calendar_publish --scenarios-file qa_scenarios.json
    ctsctl agents test --namespace $NAMESPACE/performance_marketer --scenario performance_marketer.roas_lift --scenarios-file qa_scenarios.json
    ctsctl agents test --namespace $NAMESPACE/audiovisual_producer --scenario audiovisual_producer.short_ad --scenarios-file qa_scenarios.json

    echo "[5/5] Arsenal IA %"
    READY=$(ctsctl agents health --namespace $NAMESPACE --ready --json | jq '[.agents[] | select(.status=="deployment_ready" and .health=="ok")] | length')
    TOTAL=500000
    python - <<'PY'
ready=int(open(0).read().strip() or 0); total=500000; print(f"Arsenal={ready/total*100:.2f}%")
PY <<< "$READY"
    echo "Despliegue completado."