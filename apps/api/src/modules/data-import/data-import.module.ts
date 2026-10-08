import { Module } from '@nestjs/common';
import { OffImporterService } from './off/off-importer.service';
import { OsmImporterService } from './osm/osm-importer.service';

@Module({ providers: [OffImporterService, OsmImporterService], exports: [OffImporterService, OsmImporterService] })
export class DataImportModule {}
