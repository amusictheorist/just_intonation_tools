from rest_framework import serializers

class PartialSetSerializer(serializers.Serializer):
  elements = serializers.ListField(child=serializers.IntegerField())

  def validate_elements(self, value):
    if not value:
      raise serializers.ValidationError('Set cannot be empyt.')
    return sorted(set(value))