import asyncio

from rest_framework import serializers
from .models import NetworkAnomaliesModel


class NetworkAnomalySerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkAnomaliesModel
        fields = (
            "current_work_state",
        )

    def create(self, validated_data):
        return NetworkAnomaliesModel.objects.create(**validated_data)

    async def update(self, instance, validated_data):
        instance.current_work_state = validated_data.get("current_work_state", instance.current_work_state)
        instance.save()
        return instance
