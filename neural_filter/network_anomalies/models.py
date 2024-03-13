from django.db import models


class NetworkAnomaliesModel(models.Model):
    current_work_state = models.JSONField(null=True, default=dict)

    def __str__(self):
        return f"current_work_state: {self.current_work_state}"

    class Meta:
        db_table = 'network_anomalies'
