'use strict';

(function() {
	// Stats Controller Spec
	describe('Stats Controller Tests', function() {
		// Initialize global variables
		var StatsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Stats controller.
			StatsController = $controller('StatsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Stat object fetched from XHR', inject(function(Stats) {
			// Create sample Stat using the Stats service
			var sampleStat = new Stats({
				name: 'New Stat'
			});

			// Create a sample Stats array that includes the new Stat
			var sampleStats = [sampleStat];

			// Set GET response
			$httpBackend.expectGET('stats').respond(sampleStats);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stats).toEqualData(sampleStats);
		}));

		it('$scope.findOne() should create an array with one Stat object fetched from XHR using a statId URL parameter', inject(function(Stats) {
			// Define a sample Stat object
			var sampleStat = new Stats({
				name: 'New Stat'
			});

			// Set the URL parameter
			$stateParams.statId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/stats\/([0-9a-fA-F]{24})$/).respond(sampleStat);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stat).toEqualData(sampleStat);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Stats) {
			// Create a sample Stat object
			var sampleStatPostData = new Stats({
				name: 'New Stat'
			});

			// Create a sample Stat response
			var sampleStatResponse = new Stats({
				_id: '525cf20451979dea2c000001',
				name: 'New Stat'
			});

			// Fixture mock form input values
			scope.name = 'New Stat';

			// Set POST response
			$httpBackend.expectPOST('stats', sampleStatPostData).respond(sampleStatResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Stat was created
			expect($location.path()).toBe('/stats/' + sampleStatResponse._id);
		}));

		it('$scope.update() should update a valid Stat', inject(function(Stats) {
			// Define a sample Stat put data
			var sampleStatPutData = new Stats({
				_id: '525cf20451979dea2c000001',
				name: 'New Stat'
			});

			// Mock Stat in scope
			scope.stat = sampleStatPutData;

			// Set PUT response
			$httpBackend.expectPUT(/stats\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/stats/' + sampleStatPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid statId and remove the Stat from the scope', inject(function(Stats) {
			// Create new Stat object
			var sampleStat = new Stats({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Stats array and include the Stat
			scope.stats = [sampleStat];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/stats\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStat);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.stats.length).toBe(0);
		}));
	});
}());