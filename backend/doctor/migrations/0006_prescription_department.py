# Generated by Django 5.0 on 2024-02-10 15:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doctor', '0005_remove_prescription_department'),
        ('reception', '0012_appointment_token_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescription',
            name='department',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='reception.department'),
        ),
    ]
