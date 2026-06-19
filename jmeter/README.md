# JMeter — OpenCart performance plans

Two plans, both parameterized for CLI execution (`-J` properties):

| File | Default profile | Purpose |
|---|---|---|
| `plans/OpenCart-Smoke.jmx` | 5 threads, 5 s ramp, 30 s hold | CI gate before larger profiles |
| `plans/OpenCart-Full.jmx`  | 50 threads, 60 s ramp, 300 s hold | Load baseline; override via `-J` |

## Six load profiles you can drive from one plan

```bash
# Smoke
jmeter -n -t plans/OpenCart-Smoke.jmx -l results/smoke.jtl -e -o results/smoke-html

# Load baseline (50 users, 5 min)
jmeter -n -t plans/OpenCart-Full.jmx -Jthreads=50  -Jrampup=60  -Jduration=300 \
       -l results/load50.jtl -e -o results/load50-html

# Load peak (250 users, 5 min)
jmeter -n -t plans/OpenCart-Full.jmx -Jthreads=250 -Jrampup=120 -Jduration=300 \
       -l results/load250.jtl -e -o results/load250-html

# Stress (500 users, 5 min)
jmeter -n -t plans/OpenCart-Full.jmx -Jthreads=500 -Jrampup=180 -Jduration=300 \
       -l results/stress500.jtl -e -o results/stress500-html

# Spike (500 users, 30 s ramp, 2 min hold)
jmeter -n -t plans/OpenCart-Full.jmx -Jthreads=500 -Jrampup=30  -Jduration=120 \
       -l results/spike.jtl -e -o results/spike-html

# Endurance (100 users, 60 min)
jmeter -n -t plans/OpenCart-Full.jmx -Jthreads=100 -Jrampup=120 -Jduration=3600 \
       -l results/endurance.jtl -e -o results/endurance-html
```

## Metrics captured per run
- Summary Report (Average, p90, p95, p99 — generated automatically by `-e -o`)
- Aggregate Report (per-sampler throughput)
- `results.jtl` raw JTL for downstream analysis
