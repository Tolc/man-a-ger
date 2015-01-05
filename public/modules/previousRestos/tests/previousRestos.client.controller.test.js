'use strict';

(function() {
	// PreviousRestos Controller Spec
	describe('PreviousRestos Controller Tests', function() {
		// Initialize global variables
		var PreviousRestosController,
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

			// Initialize the PreviousRestos controller.
			PreviousRestosController = $controller('PreviousRestosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one PreviousResto object fetched from XHR', inject(function(PreviousRestos) {
			// Create sample PreviousResto using the PreviousRestos service
			var samplePreviousResto = new PreviousRestos({
				name: 'New PreviousResto'
			});

			// Create a sample PreviousRestos array that includes the new PreviousResto
			var samplePreviousRestos = [samplePreviousResto];

			// Set GET response
			$httpBackend.expectGET('previousRestos').respond(samplePreviousRestos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.previousRestos).toEqualData(samplePreviousRestos);
		}));

		it('$scope.findOne() should create an array with one PreviousResto object fetched from XHR using a previousRestoId URL parameter', inject(function(PreviousRestos) {
			// Define a sample PreviousResto object
			var samplePreviousResto = new PreviousRestos({
				name: 'New PreviousResto'
			});

			// Set the URL parameter
			$stateParams.previousRestoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/previousRestos\/([0-9a-fA-F]{24})$/).respond(samplePreviousResto);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.previousResto).toEqualData(samplePreviousResto);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PreviousRestos) {
			// Create a sample PreviousResto object
			var samplePreviousRestoPostData = new PreviousRestos({
				name: 'New PreviousResto'
			});

			// Create a sample PreviousResto response
			var samplePreviousRestoResponse = new PreviousRestos({
				_id: '525cf20451979dea2c000001',
				name: 'New PreviousResto'
			});

			// Fixture mock form input values
			scope.name = 'New PreviousResto';

			// Set POST response
			$httpBackend.expectPOST('previousRestos', samplePreviousRestoPostData).respond(samplePreviousRestoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the PreviousResto was created
			expect($location.path()).toBe('/previousRestos/' + samplePreviousRestoResponse._id);
		}));

		it('$scope.update() should update a valid PreviousResto', inject(function(PreviousRestos) {
			// Define a sample PreviousResto put data
			var samplePreviousRestoPutData = new PreviousRestos({
				_id: '525cf20451979dea2c000001',
				name: 'New PreviousResto'
			});

			// Mock PreviousResto in scope
			scope.previousResto = samplePreviousRestoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/previousRestos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/previousRestos/' + samplePreviousRestoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid previousRestoId and remove the PreviousResto from the scope', inject(function(PreviousRestos) {
			// Create new PreviousResto object
			var samplePreviousResto = new PreviousRestos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new PreviousRestos array and include the PreviousResto
			scope.previousRestos = [samplePreviousResto];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/previousRestos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePreviousResto);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.previousRestos.length).toBe(0);
		}));
	});
}());
